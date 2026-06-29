# Campus Marketplace - Backend

Node and Express server for a campus buy and sell marketplace with real-time chat.
It handles user accounts, product listings, and live messaging between buyers and
sellers, with listings and chat stored in MongoDB. Authentication is JWT based.

This is the backend repo. The React frontend is in a separate repository.

## Tech stack

- Node.js with Express
- Socket.io for real-time chat
- MongoDB with Mongoose
- JSON Web Tokens for auth, bcryptjs for password hashing
- cors

## How it works

Listings are normal REST resources. The chat is the real-time part and runs over
Socket.io.

When a buyer messages a seller about an item, the server finds the existing
conversation for that buyer, seller and item, or creates one if it does not exist.
Each connected user is placed in a personal room named by their user id, so a new
message is delivered straight to both people's rooms and appears instantly.

```
buyer sends a message
    -> the server saves it and updates the conversation
    -> it is delivered to the buyer's and the seller's personal rooms
    -> the seller also gets a notification event and an unread count bump
```

Two details worth knowing:

There is never a duplicate chat thread. Each conversation has a key built from the
two user ids (sorted, so the order does not matter) plus the product id, and that key
has a unique index in MongoDB. So the same buyer, seller and item always map to one
thread.

Unread counts are real, not guessed. The server counts messages in a conversation
that you did not send and have not read yet. Opening a conversation marks them read.

Only the seller can manage their own listing. Before any edit, delete or mark-as-sold,
the server checks that the logged-in user is the item's seller.

## Project structure

```
backend/
  server.js                  HTTP server, Socket.io setup, DB connect
  app.js                     Express app, CORS, routes, error handler
  config/
    db.js                    Mongoose connection
  models/
    User.js                  account details, hashed password
    Product.js               listing fields, status (active or sold), seller
    Conversation.js          participants, product, unique participant key
    Message.js               conversation, sender, text, read flag
  controllers/
    authController.js        register, login, current user
    productController.js     list, get, create, update, delete
    chatController.js        conversations, messages, unread count
  middleware/
    authMiddleware.js        protect (HTTP token) and socket auth (socket token)
    errorHandler.js
  socket/
    socketHandler.js         the chat socket events
  routes/
    index.js                 combines the route files
    authRoutes.js
    productRoutes.js
    chatRoutes.js
  utils/
    generateToken.js         signs a 30 day JWT
```

## Socket events

```
send_message      validate, save, deliver to both users, notify the recipient
mark_read         mark a conversation's messages as read
disconnect        cleanup
```

## API routes

Auth:

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me            (token required)
```

Products:

```
GET    /api/products             browse active listings
GET    /api/products/user/:id    a user's listings (token required)
GET    /api/products/:id         one listing
POST   /api/products             create (token required)
PUT    /api/products/:id         update, including marking sold (token required)
DELETE /api/products/:id         delete (token required)
```

Chat (token required):

```
GET  /api/chat/conversations               list conversations with unread counts
POST /api/chat/conversations               find or create a conversation
GET  /api/chat/conversations/:id/messages  messages in a conversation
GET  /api/chat/unread                      total unread count
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or a free Atlas cluster)

### Install and run

```bash
npm install
npm run dev
```

### Environment variables

Create a `.env` file in the backend root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

## Deployment

The backend runs on any Node host such as Render or Railway. Set the same
environment variables there, allow the frontend's URL in the CORS settings, and use a
host that supports WebSocket connections for the chat.