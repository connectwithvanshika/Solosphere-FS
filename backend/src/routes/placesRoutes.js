import express from "express";
import Place from "../models/Place.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      category = "All",
      sort = "rating",
      page = 1,
      limit = 12,
    } = req.query;

    const filters = {};

    // FIX CATEGORY FILTER
    if (category && category !== "All") {
      filters.category = { $regex: `^${category}$`, $options: "i" };
    }

    // SEARCH
    if (search.trim()) {
      const q = search.trim();
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } }
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const perPage = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * perPage;

    // SORTING
    let sortObj = { rating: -1 };
    if (sort === "reviews") sortObj = { reviews: -1 };
    if (sort === "recent") sortObj = { createdAt: -1 };

    const [places, total] = await Promise.all([
      Place.find(filters).sort(sortObj).skip(skip).limit(perPage),
      Place.countDocuments(filters)
    ]);

    res.json({
      success: true,
      places,
      total,
      totalPages: Math.ceil(total / perPage),
      currentPage: pageNum
    });
  } catch (err) {
    console.error("GET /api/places error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
