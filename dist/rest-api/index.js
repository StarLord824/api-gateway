"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../generated/prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new prisma_1.PrismaClient();
const SECRET_KEY = "your_secret_key";
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        req.user = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, user });
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, user });
});
app.get("/users", authMiddleware, async (req, res) => {
    const cacheKey = "rest_users";
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData)
        return res.json(JSON.parse(cachedData));
    const { rows } = await pool.query("SELECT id, name, email FROM users");
    await redisClient.setEx(cacheKey, 60, JSON.stringify(rows));
    res.json(rows);
});
app.listen(5000, () => console.log("REST API running on port 5000"));
