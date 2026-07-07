const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, default: '' },
  password: { type: String, required: true }, // hasheada con bcrypt antes de guardar
  role:     { type: String, enum: ['admin', 'cliente'], default: 'cliente' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
