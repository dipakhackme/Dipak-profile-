const express = require("express");
require("dotenv").config();
require("./config/dbConnect");
const cors = require("cors");
const path = require("path");
const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS setup - must be before other middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://dipak-profile-1r52.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// For Vercel deployment - serve from public folder
if (process.env.VERCEL) {
    app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
}

// Routes
app.use("/api/contacts", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
