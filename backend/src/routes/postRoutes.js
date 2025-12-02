import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// CREATE POST
router.post("/", async (req, res) => {
  try {
    const { title, description, rating, imageUrl, category, city, tags, lat, lng } = req.body;

    const post = await Post.create({
      title,
      description,
      rating,
      imageUrl,
      category,
      city,
      tags,
      lat,
      lng
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ⭐ FILTER + SEARCH LOGIC
// ⭐ FILTER + SEARCH
router.get("/", async (req, res) => {
  try {
    const { q, city, category } = req.query;
    const filter = {};

    if (city) filter.city = new RegExp(city, "i");
    if (category) filter.category = new RegExp(category, "i");

    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { tags: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
      ];
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const { title, description, rating, imageUrl, category, city, tags, lat, lng } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, rating, imageUrl, category, city, tags, lat, lng },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
