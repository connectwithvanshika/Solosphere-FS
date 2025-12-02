


// import express from "express";
// import Post from "../models/Post.js";

// const router = express.Router();

// // CREATE POST
// router.post("/", async (req, res) => {
//   try {
//     const { title, description, rating, imageUrl, category, city, tags, lat, lng } = req.body;

//     const post = await Post.create({
//       title,
//       description,
//       rating,
//       imageUrl,
//       category,
//       city,
//       tags,
//       lat,
//       lng
//     });

//     res.status(201).json(post);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// router.get("/mine", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // // ⭐ FILTER + SEARCH LOGIC
// // router.get("/", async (req, res) => {
// //   try {
// //     const { city = "", category = "", tags = "" } = req.query;

// //     const filter = {};

// //     if (city) filter.city = new RegExp(city, "i");
// //     if (category) filter.category = new RegExp(category, "i");

// //     if (tags) {
// //       filter.tags = { $in: tags.split(",") }; // multiple filter support
// //     }

// //     const posts = await Post.find(filter).sort({ createdAt: -1 });
// //     res.json(posts);

// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });



// // ⭐ UNIVERSAL SEARCH + FILTER + SORT + PAGINATION
// router.get("/", async (req, res) => {
//   try {
//     const {
//       city = "",
//       category = "",
//       tags = "",
//       guests = "",
//       checkin = "",
//       checkout = "",
//       sort = "recent",
//       page = 1,
//       limit = 10
//     } = req.query;

//     const filter = {};

//     if (city) filter.city = new RegExp(city, "i");
//     if (category && category !== "all") filter.category = new RegExp(category, "i");
//     if (tags) filter.tags = { $in: tags.split(",") };
//     if (guests) filter.guests = { $gte: Number(guests) };

//     // (Optional future: availability filtering)
//     if (checkin && checkout) {
//       filter.availableFrom = { $lte: new Date(checkin) };
//       filter.availableTo = { $gte: new Date(checkout) };
//     }

//     // Sorting logic
//     let sortOption = {};
//     if (sort === "rating") sortOption.rating = -1;
//     else if (sort === "recent") sortOption.createdAt = -1;
//     else sortOption.createdAt = -1;

//     const skip = (page - 1) * limit;

//     const posts = await Post.find(filter)
//       .sort(sortOption)
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Post.countDocuments(filter);

//     res.json({
//       success: true,
//       total,
//       page: Number(page),
//       results: posts
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// // UPDATE POST
// router.put("/:id", async (req, res) => {
//   try {
//     const { title, description, rating, imageUrl, category, city, tags, lat, lng } = req.body;

//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.id,
//       { title, description, rating, imageUrl, category, city, tags, lat, lng },
//       { new: true }
//     );

//     res.json(updatedPost);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // DELETE POST
// router.delete("/:id", async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     res.json({ message: "Post deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// export default router;



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

// GET MY POSTS
router.get("/mine", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ⭐ SEARCH & FILTER ROUTE - FIXED
router.get("/", async (req, res) => {
  try {
    const {
      city = "",
      category = "",
      tags = "",
      guests = "",
      checkin = "",
      checkout = "",
      sort = "recent",
      page = 1,
      limit = 20
    } = req.query;

    console.log("📥 Received query params:", req.query);

    const filter = {};

    // City filter (case-insensitive)
    if (city && city.trim()) {
      filter.city = new RegExp(city.trim(), "i");
    }

    // Category filter (case-insensitive, exclude "all")
    if (category && category.trim() && category.toLowerCase() !== "all") {
      filter.category = new RegExp(category.trim(), "i");
    }

    // Tags filter (exact match in array)
    if (tags && tags.trim()) {
      filter.tags = { $in: tags.split(",").map(t => t.trim()) };
    }

    // Guests filter (greater than or equal)
    if (guests && !isNaN(guests)) {
      filter.guests = { $gte: Number(guests) };
    }

    // Date availability filter (if fields exist in schema)
    if (checkin && checkout) {
      filter.availableFrom = { $lte: new Date(checkin) };
      filter.availableTo = { $gte: new Date(checkout) };
    }

    console.log("🔍 Applied filter:", filter);

    // Sorting
    let sortOption = {};
    if (sort === "rating") sortOption.rating = -1;
    else if (sort === "recent") sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);

    console.log(`✅ Found ${posts.length} posts out of ${total} total`);

    res.json({
      success: true,
      total,
      page: Number(page),
      results: posts
    });

  } catch (error) {
    console.error("❌ Search error:", error);
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