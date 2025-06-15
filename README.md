# API Gateway with GraphQL & REST 🚀

A full-stack API Gateway project integrating REST API, GraphQL API, PostgreSQL, and Redis, with a React frontend. Designed to showcase API architecture, microservices, and performance optimization in interviews.

## 📌 Tech Stack

-   **Backend:** Node.js (Express, GraphQL, REST)
-   **Database:** PostgreSQL (Persistent Storage)
-   **Caching:** Redis (Performance Optimization)
-   **Frontend:** React + TailwindCSS
-   **Deployment:** Docker, Docker-Compose

## 📌 Features

-   ✅ REST API – CRUD operations with JWT Authentication
-   ✅ GraphQL API – Flexible querying for data
-   ✅ API Gateway – Single entry point for both APIs
-   ✅ Rate Limiting – Prevent abuse (security & performance)
-   ✅ Redis Caching – Faster responses
-   ✅ React Frontend – Uses both APIs dynamically
-   ✅ Containerized Deployment – Easy to run anywhere

## 📌 Project Structure

```bash
/api-gateway
│
├── /src
│   ├── server.ts                  # Main entry point: initializes and runs both REST + GraphQL servers
│   ├── config.ts                  # Global config (env, rate limits, CORS, secrets, etc.)
│   │
│   ├── /common                    # Shared logic used by both APIs
│   │   ├── db.ts                  # DB connection (Postgres, Mongo, etc.)
│   │   ├── logger.ts              # Winston or Pino logger instance
│   │   ├── auth.ts                # JWT/OAuth verification middleware
│   │   ├── rateLimiter.ts         # Redis/in-memory rate limiter logic
│   │   ├── cache.ts               # Redis or LRU-based cache instance
│   │   ├── types.ts               # Shared TypeScript types/interfaces
│   │   ├── errorHandler.ts        # Unified error formatting/handling logic
│   │   └── metrics.ts             # Prometheus metrics collector
│   │
│   ├── /services                  # Business logic layer, independent of REST/GraphQL
│   │   └── userService.ts         # User CRUD + Auth logic used by both APIs
│   │
│   ├── /rest                      # REST API setup
│   │   ├── index.ts               # Creates and exports the REST app
│   │   ├── router.ts              # Express Router setup
│   │   ├── controllers/
│   │   │   └── userController.ts  # Route handlers that call service logic
│   │   └── middlewares/
│   │       ├── validate.ts        # Request body/param validators
│   │       └── logging.ts         # Logs each request
│   │
│   ├── /graphql                   # GraphQL API setup
│   │   ├── index.ts               # Sets up Apollo Server (or Mercurius, etc.)
│   │   ├── schema.ts              # TypeDefs + resolvers stitched together
│   │   ├── resolvers/
│   │   │   └── userResolver.ts    # Maps GQL fields to service logic
│   │   ├── typeDefs/
│   │   │   └── user.graphql       # GraphQL schema for users
│   │   └── context.ts             # Shared context for resolvers (auth, user info, db)
│   │
│   └── /utils                     # Misc helpers (date, string manipulation, etc.)
│       └── timeUtils.ts
│
├── /scripts                       # DB seeding, cleanup, migration scripts
│   └── seed.ts
│
├── .env                           # Environment variables
├── .env.example                   # Sample env template
├── tsconfig.json                  # TypeScript config
├── package.json
├── README.md
└── docker-compose.yml            # (Optional) Redis, DB, gateway container

```
## 📌 Installation & Running Locally

### 1️⃣ Clone the Repository

```bash
git clone [https://github.com/your-username/api-gateway.git](https://github.com/your-username/api-gateway.git)
cd api-gateway
```

Markdown

## 📌 Installation & Running Locally

### 1️⃣ Clone the Repository

```bash
git clone [https://github.com/your-username/api-gateway.git](https://github.com/your-username/api-gateway.git)
cd api-gateway
```

### 2️⃣ Set Up Environment Variables
Copy .env.example to .env and configure database credentials.

### 3️⃣ Run the Application (Docker)
Bash
```
docker-compose up --build -d
```

### 4️⃣ Access the Services
Frontend: http://localhost:5173

REST API: http://localhost:5000

GraphQL API: http://localhost:6000/graphql

PostgreSQL (DB): localhost:5432

Redis (Cache): localhost:6379

## 📌 Testing the APIs
### 🔹 Test REST API (CRUD)
Bash
```
curl -X POST "http://localhost:5000/register" -H "Content-Type: application/json" -d '{"name": "Alice", "email": "alice@example.com", "password": "securepass"}'
```

### 🔹 Test GraphQL API
Visit http://localhost:6000/graphql and run this query:
```
GraphQL

query {
  users {
    id
    name
    email
  }
}
```

## 📌 Deployment Options
Frontend Deployment (Netlify)
Bash
```
cd frontend
npm install
npm run build
netlify deploy --prod
Backend Deployment (Render/Railway)
Push your backend code to GitHub.
Deploy Docker containers on Render/Railway/Fly.io.
Update Frontend API URLs to point to the live backend.
```
