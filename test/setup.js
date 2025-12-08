import mongoose from 'mongoose';

export async function startTestDB() {
  if (process.env.TEST_USE_REAL_MONGO === 'true') {
    const uri = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_test';
    await mongoose.connect(uri, { directConnection: true });
    return uri;
  }

  throw new Error('TEST_USE_REAL_MONGO not set. Set TEST_USE_REAL_MONGO=true to use a real MongoDB instance.');
}

export async function stopTestDB() {
  await mongoose.disconnect();
}
