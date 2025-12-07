import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from '../config/db.js';
import MenuItem from '../models/MenuItem.js';
import InventoryItem from '../models/InventoryItem.js';
import Table from '../models/Table.js';

async function seed() {
  await connectDB(process.env.MONGODB_URI);
  await MenuItem.deleteMany({});
  await InventoryItem.deleteMany({});
  await Table.deleteMany({});

  const inv = await InventoryItem.create([
    { name: 'Tomato', quantity: 50, unit: 'pcs', lowStockThreshold: 10 },
    { name: 'Cheese', quantity: 20, unit: 'kg', lowStockThreshold: 5 },
    { name: 'Dough', quantity: 30, unit: 'pcs', lowStockThreshold: 5 }
  ]);

  await MenuItem.create([
    { name: 'Margherita Pizza', description: 'Classic', price: 8.5, ingredients: ['Dough','Tomato','Cheese'], prepTimeMinutes: 15, category: 'Pizza' },
    { name: 'Tomato Soup', description: 'Warm soup', price: 4.0, ingredients: ['Tomato'], category: 'Starter' }
  ]);

  await Table.create([
    { number: 1, seats: 4 },
    { number: 2, seats: 2 },
    { number: 3, seats: 6 },
  ]);

  console.log('Seed complete');
  process.exit(0);
}

seed();
