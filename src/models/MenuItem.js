import mongoose from 'mongoose';
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  ingredients: [{name: String, qty: { type: Number, default: 1 }}], 
  prepTimeMinutes: { type: Number, default: 10 },
  category: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
