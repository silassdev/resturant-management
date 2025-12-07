import { Schema, model } from 'mongoose';

const TableSchema = new Schema({
  number: { type: String, required: true, unique: true },
  seats: { type: Number, default: 4 },
  status: { type: String, enum: ['available', 'reserved', 'occupied'], default: 'available' },
  currentOrder: { type: Schema.Types.ObjectId, ref: 'Order' }
});

export default model('Table', TableSchema);
