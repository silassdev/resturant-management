import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect DB', err);
  process.exit(1);
});
