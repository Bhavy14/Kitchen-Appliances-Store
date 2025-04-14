const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");  // Add this import for path
const pool = require("./db"); // Database connection file
const authRoutes = require("./routes/authRoutes"); // Authentication routes
const usersRoutes = require("./routes/users"); // ✅ Users routes
const productsRoutes = require("./routes/products"); // ✅ Products routes
const ordersRoute = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

const app = express();

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // This line serves the images

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes); // ✅ Mount users routes
app.use("/api/products", productsRoutes); // ✅ Mount products routes
app.use('/api/orders', ordersRoute);
app.use('/api/dashboard', dashboardRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Kitchen Store Backend!");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await pool.end();
  console.log("Database connection closed.");
  process.exit(0);
});

// Handle unexpected errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
