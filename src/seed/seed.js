require('dotenv').config();
import mongoose from 'mongoose';
import { hash as _hash } from 'bcryptjs';
import connectDB from '../config/db';
import { deleteMany, create } from '../models/MenuItem';
import { deleteMany as _deleteMany, create as _create } from '../models/InventoryItem';
import { deleteMany as __deleteMany, create as __create } from '../models/Table';
import { deleteMany as ___deleteMany, create as ___create } from '../models/User';

async function seed() {
  await connectDB();

  await deleteMany({});
  await _deleteMany({});
  await __deleteMany({});
  await ___deleteMany({});

  const rice = await _create({ name: 'Rice (kg)', unit: 'kg', quantity: 100, lowStockThreshold: 10 });
  const chicken = await _create({ name: 'Chicken (kg)', unit: 'kg', quantity: 50, lowStockThreshold: 5 });
  const soda = await _create({ name: 'Soda (bottle)', unit: 'bottle', quantity: 80, lowStockThreshold: 10 });

  await create({ name: 'Chicken Rice', description: 'Grilled chicken with rice', price: 8.5, inventoryItem: rice._id });
  await create({ name: 'Fried Chicken', description: 'Spicy fried chicken', price: 6.0, inventoryItem: chicken._id });
  await create({ name: 'Soda', description: 'Cold soda', price: 1.5, inventoryItem: soda._id });

  await __create({ number: 'T1', seats: 4 });
  await __create({ number: 'T2', seats: 2 });
  await __create({ number: 'T3', seats: 6 });

  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const hash = await _hash(password, 10);
  await ___create({ email: process.env.ADMIN_EMAIL || 'admin@example.com', passwordHash: hash, role: 'admin' });

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
