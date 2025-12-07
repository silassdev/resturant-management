import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export async function startTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  return uri;
}

export async function stopTestDB() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}
