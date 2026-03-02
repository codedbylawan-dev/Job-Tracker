const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });

    const exists = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());
    if (exists)
      return res.status(400).json({ error: "Email is already registered." });

    const password_hash = await bcrypt.hash(password, 10);

    // make sure the insert completes before we continue
    const result = await db
      .prepare(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      )
      .run(username.trim(), email.toLowerCase().trim(), password_hash);

    // sqlite returns lastID on run results
    const userId = result.lastID;

    const token = jwt.sign(
      { id: userId, username: username.trim() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ token, username: username.trim() });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    const user = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());

    if (!user)
      return res.status(400).json({ error: "Invalid email or password." });

    // ensure we have a valid password hash
    if (!user.password_hash) {
      console.warn("Login attempt for", email, "but no password_hash found");
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
