import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function _connect(uri) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    throw err;
  }
}

export async function connectDB(uri = DEFAULT_URI) {
  if (!uri) {
    console.error('Missing Mongo URI. Set MONGODB_URI (or MONGO_URI) in your .env');
    process.exit(1);
  }

  try {
    await _connect(uri);
  } catch (err) {
    console.error('Initial MongoDB connection error:', err.message || err);
    if ((err.name === 'MongooseServerSelectionError' || /timed out/i.test(err.message)) ) {
      console.log('Retrying MongoDB connection in 3s...');
      await new Promise(r => setTimeout(r, 3000));
      try {
        await _connect(uri);
      } catch (err2) {
        console.error('Second MongoDB connection attempt failed:', err2);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}
