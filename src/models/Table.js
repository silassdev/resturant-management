import mongoose from 'mongoose';
const { Schema } = mongoose;

const TableSchema = new Schema({
  number: { type: Number, required: true, unique: true },
  seats: { type: Number, required: true },
  location: String,
  status: { type: String, enum: ['available','occupied','reserved','maintenance'], default: 'available' }
}, { timestamps: true });

export default mongoose.models.Table || mongoose.model('Table', TableSchema);
