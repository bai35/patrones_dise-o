const express = require('express');
const Dish = require('../models/Dish');
const { requireAuth, requireAdmin } = require('../auth');

const router = express.Router();

// GET /api/dishes — público (cualquiera puede ver la carta)
router.get('/', async (req, res) => {
  const dishes = await Dish.find().sort({ createdAt: 1 });
  res.json({ dishes });
});

// POST /api/dishes — solo admin: crear plato nuevo
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, desc, price, onOffer, offerPrice } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios.' });
    }
    const count = await Dish.countDocuments();
    const no = String(count + 1).padStart(2, '0');
    const dish = await Dish.create({
      no, name, desc: desc || '', price,
      onOffer: !!onOffer, offerPrice: onOffer ? offerPrice : null
    });
    res.status(201).json({ dish });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al crear el plato.' });
  }
});

// PUT /api/dishes/:id — solo admin: editar plato (nombre, precio, oferta)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, desc, price, onOffer, offerPrice } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = name;
    if (desc !== undefined) patch.desc = desc;
    if (price !== undefined) patch.price = price;
    if (onOffer !== undefined) patch.onOffer = onOffer;
    if (offerPrice !== undefined) patch.offerPrice = onOffer ? offerPrice : null;

    const dish = await Dish.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!dish) return res.status(404).json({ error: 'Plato no encontrado.' });
    res.json({ dish });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al actualizar el plato.' });
  }
});

// DELETE /api/dishes/:id — solo admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);
  if (!dish) return res.status(404).json({ error: 'Plato no encontrado.' });
  res.json({ success: true });
});

module.exports = router;
