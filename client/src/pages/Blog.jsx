import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`);
      const data = await response.json();
      if (data.success) {
        setBlogPosts(data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-16 min-h-screen flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mt-16 sm:mt-18 lg:mt-20">
      <div className="hidden lg:block -mt-28">
        <div className="sticky top-24">
          <HeroSection />
        </div>
      </div>

      <div className="flex-1 w-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto border border-yellow-400/20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            📝 Blog
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6 sm:mb-8"></div>
          
          <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-gray-300 leading-relaxed">
            Sharing my thoughts, experiences, and knowledge about web development, programming, and technology.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">Loading blogs...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No blogs available yet.</p>
            </div>
          ) : (
            blogPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="bg-gradient-to-br from-[#111]/70 to-[#1a1a1a]/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-700/50 hover:border-yellow-400/30 group"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.publishDate || post.createdAt).toLocaleDateString()} • {post.publishTime || new Date(post.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-yellow-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>
            </motion.div>
          )))}
        </div>
      </div>

      {selectedPost && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] max-w-xs sm:max-w-lg lg:max-w-2xl w-full rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-yellow-400/30 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-48 sm:h-64 lg:h-96 object-cover"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-400/20 text-yellow-400 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                  {selectedPost.category}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">{selectedPost.date}</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">{selectedPost.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed blog-content" dangerouslySetInnerHTML={{ __html: selectedPost.excerpt }}></p>
              <div className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 blog-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }}></div>

              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transform transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                onClick={() => setSelectedPost(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
