import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../generated/prisma";

dotenv.config();
const app = express();

app.use(express.json());

const prisma = new PrismaClient();

const SECRET_KEY = "your_secret_key";

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/register", async (req : Request, res : Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user });
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

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
