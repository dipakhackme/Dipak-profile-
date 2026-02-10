const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
} = require("../controllers/blogController");

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/category/:category", getBlogsByCategory);

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }
    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// Admin routes
router.post("/", upload.single("image"), createBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
