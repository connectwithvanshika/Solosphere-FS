// backend/src/routes/tipsRoutes.js
import express from "express";
import Tip from "../models/Tip.js";

const router = express.Router();

/**
 * GET /api/tips
 * Query params:
 *  - city (string)   e.g. 'Goa' or 'All'
 *  - category (string) e.g. 'Safety' or 'All'
 *  - search (string) text search across title/excerpt/content
 *  - page (number) default 1
 *  - limit (number) default 6
 */
router.get("/", async (req, res) => {
  try {
    const {
      city = "All",
      category = "All",
      search = "",
      page = 1,
      limit = 6
    } = req.query;

    const filters = {};

    if (city && city !== "All") filters.city = city;
    if (category && category !== "All") filters.category = category;

    if (search && search.trim()) {
      const q = search.trim();
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const perPage = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * perPage;

    const [tips, total] = await Promise.all([
      Tip.find(filters).sort({ createdAt: -1 }).skip(skip).limit(perPage),
      Tip.countDocuments(filters)
    ]);

    res.json({
      tips,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      currentPage: pageNum
    });
  } catch (err) {
    console.error("GET /api/tips error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
