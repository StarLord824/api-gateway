"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const pool = new Pool({ connectionString: process.env.PG_URI });
const redisClient = Redis.createClient({ url: process.env.REDIS_URI });
redisClient.connect();
const SECRET_KEY = "your_secret_key";
const typeDefs = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type AuthPayload {
    token: String!
    user: User!
  }
  type Query {
    users: [User]
  }
  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateUser(id: ID!, name: String, email: String): User
  }
`;
const resolvers = {
    Query: {
        users: async (_, __, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const cacheKey = "graphql_users";
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData)
                return JSON.parse(cachedData);
            const { rows } = await pool.query("SELECT id, name, email FROM users");
            await redisClient.setEx(cacheKey, 60, JSON.stringify(rows));
            return rows;
        },
    },
    Mutation: {
        register: async (_, { name, email, password }) => {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);
            const user = result.rows[0];
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = result.rows[0];
            if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
                throw new Error("Invalid credentials");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
            return { token, user };
        },
        updateUser: async (_, { id, name, email }, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const result = await pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, id]);
            if (result.rowCount > 0) {
                await redisClient.del("graphql_users");
                return result.rows[0];
            }
            throw new Error("User not found");
        },
    },
};
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        try {
            const decoded = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), SECRET_KEY);
            return { user: decoded };
        }
        catch {
            return { user: null };
        }
    },
});
async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}
startServer();
app.listen(6000, () => console.log("GraphQL API running on port 6000"));
