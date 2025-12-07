import { Schema, model } from 'mongoose';

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true },
  inventoryItem: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },
  createdAt: { type: Date, default: Date.now }
});

export default model('MenuItem', MenuItemSchema);
