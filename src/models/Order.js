import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,
  quantity: { type: Number, default: 1, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const OrderSchema = new Schema({
  items: [OrderItemSchema],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  type: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], default: 'dine-in' },
  table: { type: Schema.Types.ObjectId, ref: 'Table' },
  reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
  createdAt: { type: Date, default: Date.now },
  processedAt: Date
});

export default model('Order', OrderSchema);
