const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name:   { type: String, required: true, trim: true },
  phone:  { type: String, default: '' },
  date:   { type: String, required: true }, // formato YYYY-MM-DD (input type=date)
  time:   { type: String, required: true }, // formato HH:MM
  party:  { type: Number, required: true, min: 1 },
  note:   { type: String, default: '' },
  status: { type: String, enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente' },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
