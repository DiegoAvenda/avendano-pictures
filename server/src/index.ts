// src/index.ts – Server bootstrap
import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env');
  process.exit(1);
}

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
