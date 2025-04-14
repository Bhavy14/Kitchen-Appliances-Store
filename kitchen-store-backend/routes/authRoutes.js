const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword, mobile } = req.body;

        // Validate required fields
        if (!name || !email || !password || !confirmPassword || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Validate mobile number length
        if (mobile.length !== 10) {
            return res.status(400).json({ message: "Mobile number must be 10 digits" });
        }

        // Check if user already exists (by email or mobile)
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR mobile = $2",
            [email, mobile]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Email or Mobile already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, mobile) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, mobile]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

    } catch (err) {
        console.error("Error in Register Route:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request received:", { email });

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        console.log("User lookup result:", user.rows);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not found in env!");
            return res.status(500).json({ message: "Token generation error" });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, email: user.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Token generated successfully");

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.rows[0].name,
                email: user.rows[0].email
            }
        });
        
    } catch (err) {
        console.error("Login route error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
});

// Get current logged-in user info
router.get("/user", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Missing token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [decoded.userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: user.rows[0] });
    } catch (err) {
        console.error("Error in /user route:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;