import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { socketAuth } from './middleware/authMiddleware.js';
import { initSocket } from './socket/socketHandler.js';

dotenv.config();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use(socketAuth);
initSocket(io);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
      console.log('💬 WebSocket chat enabled');
    });
  })
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));
