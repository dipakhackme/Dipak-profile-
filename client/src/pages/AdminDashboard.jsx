import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiEye, FiPlus, FiLogOut, FiBarChart2 } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [stats, setStats] = useState({ total: 0, published: 0, views: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
        setStats({
          total: data.data.length,
          published: data.data.filter(b => b.published).length,
          views: data.data.reduce((sum, b) => sum + (b.views || 0), 0),
        });
      }
    } catch (error) {
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedBlog(data.data);
      }
    } catch (error) {
      toast.error("Error fetching blog details");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Error deleting blog");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] border-b border-yellow-400/20 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage your blog posts</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/admin/create-blog")}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2.5 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow-lg text-sm sm:text-base"
              >
                <FiPlus className="text-lg" />
                Create Blog
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-500/30 text-sm sm:text-base"
              >
                <FiLogOut className="text-lg" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[
            { label: "Total Blogs", value: stats.total, icon: FiBarChart2, color: "from-blue-500 to-blue-600" },
            { label: "Published", value: stats.published, icon: FiEye, color: "from-green-500 to-green-600" },
            { label: "Total Views", value: stats.views, icon: FiBarChart2, color: "from-yellow-500 to-yellow-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="text-2xl text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blogs Table/Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No blogs yet</p>
            <button
              onClick={() => navigate("/admin/create-blog")}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold"
            >
              Create Your First Blog
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl border border-gray-700/50 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Blog</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Category</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Views</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, index) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={blog.image} alt={blog.title} className="w-16 h-16 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold line-clamp-1">{blog.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">{blog.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{blog.views}</td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleView(blog._id)}
                            className="p-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            title="View"
                          >
                            <FiEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                            className="p-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-700/30">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex gap-3 mb-3">
                    <img src={blog.image} alt={blog.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2 mb-1">{blog.title}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-yellow-400/20 text-yellow-400 font-semibold px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-gray-400">{blog.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(blog._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg text-sm font-semibold"
                    >
                      <FiEye /> View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 px-3 py-2 rounded-lg text-sm font-semibold"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm font-semibold"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Blog Modal */}
      {selectedBlog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden border border-yellow-400/30 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-64 sm:h-80 object-cover" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">
                  {selectedBlog.category}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(selectedBlog.publishDate || selectedBlog.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-400">{selectedBlog.views} views</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">{selectedBlog.title}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{selectedBlog.excerpt}</p>
              <p className="text-gray-400 mb-6 leading-relaxed">{selectedBlog.content}</p>
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBlog.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <button
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600"
                onClick={() => setSelectedBlog(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
