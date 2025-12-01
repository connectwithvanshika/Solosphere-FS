import express from "express";
import Post from "../models/Post.js"; // must exist in /models/
const router = express.Router();

// CREATE POST
router.post("/", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

export default router;
