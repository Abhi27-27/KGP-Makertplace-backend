# ⚙️ KGP Marketplace — Backend

<div align="center">

![KGP Marketplace](https://img.shields.io/badge/KGP-Marketplace-1e3a8a?style=for-the-badge&logo=node.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)

**REST API + WebSocket server for the KGP Marketplace**

[🌐 Frontend Live Demo](https://kgp-makertplace-frontend.vercel.app/) · [💻 Frontend Repo](https://github.com/Abhi27-27/KGP-Makertplace-Frontend) · [🐛 Report Bug](https://github.com/Abhi27-27/KGP-Makertplace-backend/issues)

</div>

---

## 📌 Overview

This is the **Node.js/Express backend** for KGP Marketplace — a peer-to-peer campus marketplace for IIT Kharagpur students. It provides a REST API for authentication, product listings, and chat, along with a real-time WebSocket layer via Socket.io.

---

## 🔗 Frontend

> **Live App:** [https://kgp-makertplace-frontend.vercel.app/](https://kgp-makertplace-frontend.vercel.app/)
>
> **Frontend Repository:** [https://github.com/Abhi27-27/KGP-Makertplace-Frontend](https://github.com/Abhi27-27/KGP-Makertplace-Frontend)

---

## ✨ Features

- 🔐 **JWT Authentication** — Stateless auth with 30-day tokens and bcrypt password hashing
- 🛍️ **Product CRUD** — Create, read, and delete listings with seller authorization checks
- 💬 **Real-Time Chat** — Socket.io messaging with room-based delivery per user
- 📬 **Unread Message Tracking** — Per-conversation unread counts with mark-as-read support
- 🔔 **Chat Notifications** — Server-side push events for new messages to offline-tab recipients
- 🔑 **Route Protection** — Middleware-based auth guard on all protected endpoints
- 🗄️ **MongoDB** — Mongoose schemas with participant key deduplication for conversations

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js 18 (ESM) |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose |
| Real-Time | Socket.io 4 |
| Auth | JWT + bcryptjs |
| Environment | dotenv |

---

## 📁 Project Structure

```
├── server.js               # Entry point — HTTP + Socket.io server
├── app.js                  # Express app, middleware, routes
├── config/
│   └── db.js               # MongoDB connection
├── routes/
│   ├── index.js            # Route aggregator (/api)
│   ├── authRoutes.js       # POST /auth/register, /auth/login
│   ├── productRoutes.js    # GET/POST/DELETE /products
│   └── chatRoutes.js       # GET/POST /chat/conversations, /messages
├── controllers/
│   ├── authController.js   # Register & login logic
│   ├── productController.js# CRUD for listings
│   └── chatController.js   # Conversations, messages, unread count
├── middleware/
│   ├── authMiddleware.js   # protect (HTTP) + socketAuth (WS)
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── User.js             # name, email, rollNumber, password (hashed)
│   ├── Product.js          # title, price, category, location, seller ref
│   ├── Conversation.js     # participants[], product ref, participantKey
│   └── Message.js          # conversation ref, sender ref, text, read
├── socket/
│   └── socketHandler.js    # send_message, mark_read socket events
└── utils/
    └── generateToken.js    # JWT sign helper
```

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new student | ❌ |
| POST | `/api/auth/login` | Login and receive JWT | ❌ |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | Get all listings | ❌ |
| GET | `/api/products/:id` | Get single listing | ❌ |
| GET | `/api/products/user/:userId` | Get your listings | ✅ |
| POST | `/api/products` | Create a listing | ✅ |
| DELETE | `/api/products/:id` | Delete your listing | ✅ |

### Chat

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/chat/conversations` | List all conversations | ✅ |
| POST | `/api/chat/conversations` | Start/get conversation | ✅ |
| GET | `/api/chat/conversations/:id/messages` | Get messages | ✅ |
| GET | `/api/chat/unread` | Get total unread count | ✅ |

### WebSocket Events

| Event | Direction | Payload |
|---|---|---|
| `send_message` | Client → Server | `{ conversationId, text }` |
| `new_message` | Server → Client | `{ message, conversationId }` |
| `mark_read` | Client → Server | `{ conversationId }` |
| `messages_read` | Server → Client | `{ conversationId }` |
| `chat_notification` | Server → Client | `{ message, senderName }` |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abhi27-27/KGP-Makertplace-backend.git
cd KGP-Makertplace-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kgp-marketplace
JWT_SECRET=your_super_secret_jwt_key
```

### Run Locally

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

<div align="center">
Made by <a href="https://github.com/Abhi27-27">Marreddy Abhiram Muni Reddy</a> · IIT Kharagpur
</div>
