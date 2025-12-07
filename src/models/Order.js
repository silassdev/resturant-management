import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,
  quantity: { type: Number, default: 1 },
  price: Number
}, { _id: false });

const OrderSchema = new Schema({
  table: { type: Schema.Types.ObjectId, ref: 'Table' },
  items: [OrderItemSchema],
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['pending','preparing','served','completed','cancelled'], default: 'pending' },
  placedAt: { type: Date, default: Date.now },
  servedAt: Date,
  notes: String
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
