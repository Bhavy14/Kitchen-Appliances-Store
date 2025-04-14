const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Validate environment variables
if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASS || !process.env.DB_PORT) {
    console.error("Missing database environment variables. Check your .env file.");
    process.exit(1);
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

pool.query("SELECT 1") // Check if DB is accessible
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1); // Stop server if DB connection fails
    });

module.exports = pool;