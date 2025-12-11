import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import InventoryItem from '../src/models/InventoryItem.js';

const uri = process.env.MONGODB_URI;
await mongoose.connect(uri);

const items = [
  { name: 'Rice', quantity: 200, unit: 'kg' },
  { name: 'Tomato', quantity: 100, unit: 'kg' },
  { name: 'Spices', quantity: 50, unit: 'kg' },
  { name: 'Dough', quantity: 50, unit: 'pcs' },
  { name: 'Cheese', quantity: 30, unit: 'kg' }
];

await InventoryItem.insertMany(items);
console.log('Seeded inventory');
await mongoose.disconnect();
process.exit(0);
