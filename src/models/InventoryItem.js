import { Schema, model } from 'mongoose';

const InventoryItemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, default: 'unit' },
  quantity: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

export default model('InventoryItem', InventoryItemSchema);
