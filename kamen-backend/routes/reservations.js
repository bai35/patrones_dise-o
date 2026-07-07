const express = require('express');
const Reservation = require('../models/Reservation');
const { requireAuth, requireAdmin } = require('../auth');

const router = express.Router();

// POST /api/reservations — público: cualquiera puede reservar (con o sin sesión)
router.post('/', async (req, res) => {
  try {
    const { name, phone, date, time, party, note, userId } = req.body;
    if (!name || !date || !time || !party) {
      return res.status(400).json({ error: 'Nombre, fecha, hora y número de personas son obligatorios.' });
    }
    const reservation = await Reservation.create({
      name, phone: phone || '', date, time, party, note: note || '',
      userId: userId || null
    });
    res.status(201).json({ reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al crear la reserva.' });
  }
});

// GET /api/reservations — solo admin: ver todas las reservas
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  res.json({ reservations });
});

// GET /api/reservations/mine — cliente autenticado: ver solo las suyas
router.get('/mine', requireAuth, async (req, res) => {
  const reservations = await Reservation.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ reservations });
});

// PATCH /api/reservations/:id/status — solo admin: confirmar / cancelar
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['pendiente', 'confirmada', 'cancelada'].includes(status)) {
    return res.status(400).json({ error: 'Estado inválido.' });
  }
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada.' });
  res.json({ reservation });
});

// DELETE /api/reservations/:id — solo admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada.' });
  res.json({ success: true });
});

module.exports = router;
