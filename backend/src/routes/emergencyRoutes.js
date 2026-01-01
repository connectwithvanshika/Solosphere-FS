import express from "express";
import EmergencyLog from "../models/EmergencyLog.js";

const router = express.Router();

// LOG EMERGENCY ACTIVATION
router.post("/log", async (req, res) => {
    try {
        const { userId, lat, lng, city } = req.body;

        const log = await EmergencyLog.create({
            userId,
            location: { lat, lng, city }
        });

        res.status(201).json({ success: true, log });
    } catch (error) {
        console.error("❌ Emergency Log Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
