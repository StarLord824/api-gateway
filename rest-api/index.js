const express = require("express");
const { Pool } = require("pg");
const Redis = require("redis");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.PG_URI });
const redisClient = Redis.createClient({ url: process.env.REDIS_URI });
redisClient.connect();

const SECRET_KEY = "your_secret_key";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  const user = result.rows[0];

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user });
});

app.get("/users", authMiddleware, async (req, res) => {
  const cacheKey = "rest_users";
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) return res.json(JSON.parse(cachedData));

  const { rows } = await pool.query("SELECT id, name, email FROM users");
  await redisClient.setEx(cacheKey, 60, JSON.stringify(rows));
  res.json(rows);
});

app.listen(5000, () => console.log("REST API running on port 5000"));
