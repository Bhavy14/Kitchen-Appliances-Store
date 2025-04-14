const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db"); // Import database connection

const router = express.Router();

// Configure multer to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File validation: only allow image files (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files (jpg, jpeg, png) are allowed"), false);
  }
  cb(null, true);
};

// Limit file size to 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// 1. GET all products
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. POST create a new product
router.post("/", upload.single("image"), async (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || !price || !stock) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      "INSERT INTO products (name, category, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, category, price, stock, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 3. PUT update a product
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;

  if (!name || !category || !price || !stock) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      "UPDATE products SET name = $1, category = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *",
      [name, category, price, stock, imageUrl, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 4. DELETE a product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
    res.send("Product deleted");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
