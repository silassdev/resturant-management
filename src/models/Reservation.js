import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  customerName: { type: String, required: true },
  phone: String,
  partySize: { type: Number, required: true },
  table: { type: Schema.Types.ObjectId, ref: 'Table' },
  reservedAt: { type: Date, required: true },
  notes: String,
  status: { type: String, enum: ['active','completed','cancelled'], default: 'active' }
}, { timestamps: true });

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
