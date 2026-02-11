import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiImage, FiTag, FiFileText, FiEdit3, FiSave, FiX, FiEye, FiUpload, FiSearch } from "react-icons/fi";
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import CodeBlock from '@tiptap/extension-code-block';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: null,
    category: "",
    tags: "",
    author: "Deepak Kumar Sah",
    published: true,
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  });
  const [imagePreview, setImagePreview] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const handleContentImageUpload = async (file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${API_URL}/api/blogs/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        editor?.chain().focus().setImage({ src: data.imageUrl }).run();
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      toast.error('Error uploading image');
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      TextStyle,
      Color,
      CodeBlock,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
  });

  const excerptEditor = useEditor({
    extensions: [StarterKit, Link, TextStyle, Color],
    content: formData.excerpt,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, excerpt: editor.getHTML() });
    },
  });

  const categories = [
    "Artificial Intelligence", "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision",
    "Data Science", "Data Analytics", "Big Data", "Data Engineering", "Business Intelligence",
    "Web Development", "Frontend Development", "Backend Development", "Full Stack Development",
    "Mobile Development", "iOS Development", "Android Development", "React Native", "Flutter",
    "Cloud Computing", "AWS", "Azure", "Google Cloud", "Cloud Architecture",
    "DevOps", "CI/CD", "Docker", "Kubernetes", "Jenkins", "Terraform",
    "Cybersecurity", "Ethical Hacking", "Penetration Testing", "Network Security", "Information Security",
    "Blockchain", "Cryptocurrency", "Smart Contracts", "Web3", "NFT",
    "Internet of Things", "Embedded Systems", "Robotics", "Arduino", "Raspberry Pi",
    "Database", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Redis",
    "Programming Languages", "JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
    "Frameworks", "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Laravel",
    "UI/UX Design", "Graphic Design", "Product Design", "Figma", "Adobe XD",
    "Game Development", "Unity", "Unreal Engine", "Game Design",
    "Software Engineering", "Software Architecture", "Design Patterns", "Microservices", "System Design",
    "Testing", "Software Testing", "Test Automation", "QA", "Selenium",
    "API Development", "REST API", "GraphQL", "API Design",
    "Version Control", "Git", "GitHub", "GitLab", "Bitbucket",
    "Operating Systems", "Linux", "Windows", "macOS", "Unix",
    "Networking", "Network Engineering", "TCP/IP", "DNS", "VPN",
    "Algorithms", "Data Structures", "Competitive Programming", "Problem Solving",
    "Agile", "Scrum", "Project Management", "Kanban",
    "Career", "Interview Preparation", "Coding Interview", "Tech Career",
    "Open Source", "Contributing", "GitHub Projects",
    "Performance Optimization", "Code Quality", "Best Practices",
    "Other"
  ];

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    if (id) fetchBlog();
  }, [id, navigate]);

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
    if (excerptEditor && formData.excerpt !== excerptEditor.getHTML()) {
      excerptEditor.commands.setContent(formData.excerpt);
    }
  }, [formData.content, formData.excerpt, editor, excerptEditor]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/${id}`);
      const data = await response.json();
      if (data.success) {
        setFormData({
          ...data.data,
          tags: data.data.tags?.join(", ") || "",
          image: null,
        });
        setImagePreview(`${API_URL}${data.data.image}`);
      }
    } catch (error) {
      toast.error("Error fetching blog");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("excerpt", formData.excerpt);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("published", publishStatus);
    formDataToSend.append("publishDate", formData.publishDate);
    formDataToSend.append("publishTime", formData.publishTime);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const url = id
        ? `${API_URL}/api/blogs/${id}`
        : `${API_URL}/api/blogs`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        toast.success(id ? "Blog updated successfully" : "Blog created successfully");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent flex items-center gap-3">
              <FiEdit3 className="text-yellow-400" />
              {id ? "Edit Blog Post" : "Create New Blog"}
            </h1>
            <p className="text-gray-400 mt-2">Share your knowledge with the world</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form className="space-y-6">
              {/* Title */}
              <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
                <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                  <FiFileText /> Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Excerpt */}
              <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
                <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                  <FiEye /> Short Description (Max 400 words)
                </label>
                <div className="rich-text-editor-dark">
                  <RichTextEditor editor={excerptEditor}>
                    <RichTextEditor.Toolbar>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.ColorPicker
                          colors={[
                            '#000000', '#ffffff', '#facc15', '#fbbf24',
                            '#f59e0b', '#f97316', '#ef4444', '#dc2626',
                            '#ec4899', '#d946ef', '#a855f7', '#8b5cf6',
                          ]}
                        />
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content style={{ minHeight: '120px' }} />
                  </RichTextEditor>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
                <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                  <FiEdit3 /> Full Content
                </label>
                <div className="rich-text-editor-dark">
                  <RichTextEditor editor={editor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.Code />
                        <RichTextEditor.CodeBlock />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignRight />
                        <RichTextEditor.AlignJustify />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Highlight />
                        <RichTextEditor.ColorPicker
                          colors={[
                            '#000000', '#ffffff', '#facc15', '#fbbf24',
                            '#f59e0b', '#f97316', '#ef4444', '#dc2626',
                            '#ec4899', '#d946ef', '#a855f7', '#8b5cf6',
                            '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4',
                            '#14b8a6', '#10b981', '#22c55e', '#84cc16',
                          ]}
                        />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Control
                          onClick={() => document.getElementById('content-image-upload').click()}
                        >
                          <FiImage />
                        </RichTextEditor.Control>
                        <input
                          id="content-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleContentImageUpload(e.target.files[0])}
                          className="hidden"
                        />
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content style={{ minHeight: '400px' }} />
                  </RichTextEditor>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  <FiEye />
                  {loading ? "Saving..." : "Publish"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  <FiSave />
                  {loading ? "Saving..." : "Save Draft"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-8 bg-gray-800 text-white font-semibold py-4 rounded-xl hover:bg-gray-700 border border-gray-700 flex items-center gap-2 transition-all"
                >
                  <FiX /> Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Image */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
              <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                <FiImage /> Featured Image
              </label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700/50 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <div className="text-center">
                        <FiUpload className="mx-auto text-2xl text-yellow-400 mb-2" />
                        <span className="text-sm text-white">Change Image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 bg-black/40 border-2 border-dashed border-gray-700/50 rounded-xl text-gray-400 hover:border-yellow-500 hover:text-yellow-400 cursor-pointer transition-all">
                    <FiUpload className="text-3xl mb-2" />
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
              <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                <FiTag /> Category
              </label>
              <div className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategories(true);
                    }}
                    onFocus={() => setShowCategories(true)}
                    placeholder="Search category..."
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                {showCategories && filteredCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 max-h-60 overflow-y-auto bg-[#1e1e1e] border border-gray-700/50 rounded-xl shadow-lg">
                    {filteredCategories.map((cat, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData({ ...formData, category: cat });
                          setCategorySearch(cat);
                          setShowCategories(false);
                        }}
                        className="px-4 py-2 hover:bg-yellow-500/10 cursor-pointer text-sm text-gray-300 hover:text-yellow-400 transition-all"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formData.category && (
                <div className="mt-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs inline-block">
                  {formData.category}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
              <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                <FiTag /> Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Separate tags with commas</p>
            </div>

            {/* Author */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
              <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                <FiEdit3 /> Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Publish Settings */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all">
              <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400 mb-3">
                <FiEye /> Schedule
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-black/40 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Time</label>
                    <input
                      type="time"
                      name="publishTime"
                      value={formData.publishTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-black/40 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-400/20">
              <h3 className="font-semibold text-yellow-400 mb-3">✨ Pro Tips</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Use clear, descriptive titles</li>
                <li>• Keep excerpts under 160 characters</li>
                <li>• Add relevant tags for better discovery</li>
                <li>• Use high-quality images</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
