const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  no:         { type: String, default: '' },       // número de orden visual en la carta, ej "01"
  name:       { type: String, required: true, trim: true },
  desc:       { type: String, default: '' },
  price:      { type: Number, required: true, min: 0 },
  onOffer:    { type: Boolean, default: false },
  offerPrice: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Dish', DishSchema);
