const Blog = require("../model/Blog");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, published } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === "true";

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const blogData = req.body;
    if (req.file) {
      blogData.image = req.file.path;
    }
    const blog = await Blog.create(blogData);
    
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blogData = req.body;
    if (req.file) {
      blogData.image = req.file.path;
    }
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      category: req.params.category,
      published: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs by category",
      error: error.message,
    });
  }
};
