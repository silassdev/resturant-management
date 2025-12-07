import mongoose from 'mongoose';
const { Schema } = mongoose;

const InventoryItemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, default: 'pcs' },
  lowStockThreshold: { type: Number, default: 5 },
}, { timestamps: true });

export default mongoose.models.InventoryItem || mongoose.model('InventoryItem', InventoryItemSchema);
