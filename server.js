import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));
