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
api-gateway/
├── frontend/         # React App (Netlify Deployable)
├── rest-api/         # Express REST API
├── graphql-api/      # GraphQL API
├── docker-compose.yml # Containerized Setup
├── .env              # Environment Configurations
├── README.md         # Documentation
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
📌 Testing the APIs
🔹 Test REST API (CRUD)
Bash
```
curl -X POST "http://localhost:5000/register" -H "Content-Type: application/json" -d '{"name": "Alice", "email": "alice@example.com", "password": "securepass"}'
```

##🔹 Test GraphQL API
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
