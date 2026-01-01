import express from "express";
import TravelPlan from "../models/TravelPlan.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import Block from "../models/Block.js";
import Report from "../models/Report.js";
import User from "../models/User.js";

const router = express.Router();

/* -------------------- TRAVEL PLANS -------------------- */

// CREATE OR UPDATE TRAVEL PLAN
router.post("/plans", async (req, res) => {
    try {
        const { userId, city, startDate, endDate, genderPreference } = req.body;

        let plan = await TravelPlan.findOne({ userId });

        if (plan) {
            plan.city = city;
            plan.startDate = startDate;
            plan.endDate = endDate;
            plan.genderPreference = genderPreference;
            plan.isActive = true;
            await plan.save();
        } else {
            plan = await TravelPlan.create({
                userId,
                city,
                startDate,
                endDate,
                genderPreference
            });
        }

        res.status(200).json({ success: true, plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET MY PLAN
router.get("/plans/:userId", async (req, res) => {
    try {
        const plan = await TravelPlan.findOne({ userId: req.params.userId });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/* -------------------- MATCHING LOGIC -------------------- */

// GET MATCHES
router.get("/matches/:userId", async (req, res) => {
    try {
        const userPlan = await TravelPlan.findOne({ userId: req.params.userId });
        if (!userPlan || !userPlan.isActive) {
            return res.json([]);
        }

        // Get blocked users
        const blocked = await Block.find({ blockerId: req.params.userId }).select("blockedUserId");
        const blockedIds = blocked.map(b => b.blockedUserId);

        // Get matching plans
        // 1. Same city
        // 2. Date overlap (StartA <= EndB AND StartB <= EndA)
        // 3. Not the same user
        // 4. Not blocked
        const matches = await TravelPlan.find({
            userId: { $ne: req.params.userId, $nin: blockedIds },
            city: new RegExp(userPlan.city, "i"),
            startDate: { $lte: userPlan.endDate },
            endDate: { $gte: userPlan.startDate },
            isActive: true
        }).populate("userId", "name gender verified");

        res.json(matches);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/* -------------------- CONNECTIONS -------------------- */

// SEND REQUEST
router.post("/connect/request", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        // Check existing
        const existing = await ConnectionRequest.findOne({ senderId, receiverId });
        if (existing) return res.status(400).json({ message: "Already sent" });

        const request = await ConnectionRequest.create({ senderId, receiverId });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// RESPOND TO REQUEST
router.patch("/connect/respond", async (req, res) => {
    try {
        const { requestId, status } = req.body; // status: accepted/declined
        const request = await ConnectionRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );
        res.json(request);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET MY REQUESTS (RECEIVED)
router.get("/connect/requests/:userId", async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            receiverId: req.params.userId,
            status: "pending"
        }).populate("senderId", "name gender verified");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/* -------------------- SAFETY -------------------- */

// BLOCK USER
router.post("/block", async (req, res) => {
    try {
        const { blockerId, blockedUserId } = req.body;
        await Block.create({ blockerId, blockedUserId });
        res.json({ success: true, message: "User blocked" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// REPORT USER
router.post("/report", async (req, res) => {
    try {
        const { reporterId, reportedUserId, reason } = req.body;
        await Report.create({ reporterId, reportedUserId, reason });
        res.json({ success: true, message: "Report submitted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
