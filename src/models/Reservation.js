import { Schema, model } from 'mongoose';

const ReservationSchema = new Schema({
  name: { type: String, required: true },
  contact: String,
  partySize: { type: Number, default: 2 },
  table: { type: Schema.Types.ObjectId, ref: 'Table' },
  startTime: { type: Date, required: true },
  endTime: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default model('Reservation', ReservationSchema);
