require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const dishRoutes = require('./routes/dishes');
const reservationRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Sirve el frontend (carpeta /public) como sitio estático
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/reservations', reservationRoutes);

// Chequeo de salud, útil para Render/Railway
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Cualquier otra ruta que no sea /api devuelve el frontend (para que funcione como SPA)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🐉 Kam Men backend escuchando en puerto ${PORT}`));
});
