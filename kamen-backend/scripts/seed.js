// Ejecutar con: npm run seed
// Crea (o reemplaza) los 3 usuarios de prueba y los platos iniciales en MongoDB Atlas.
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../db');
const User = require('../models/User');
const Dish = require('../models/Dish');

async function seed() {
  await connectDB();

  console.log('Limpiando usuarios y platos existentes...');
  await User.deleteMany({});
  await Dish.deleteMany({});

  console.log('Creando usuarios de prueba...');
  const usersData = [
    { name: 'Administrador Kam Men', email: 'admin@kammen.pe',   phone: '974635013', password: 'admin123',   role: 'admin' },
    { name: 'María Gutiérrez',        email: 'maria@cliente.pe',  phone: '987111222', password: 'cliente123', role: 'cliente' },
    { name: 'Jorge Ramírez',          email: 'jorge@cliente.pe',  phone: '987333444', password: 'cliente123', role: 'cliente' },
  ];

  for (const u of usersData) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`  • ${u.role.padEnd(8)} ${u.email}  (contraseña: ${u.password})`);
  }

  console.log('Creando platos iniciales...');
  const dishesData = [
    { no: '01', name: 'Arroz Chaufa Kam Men',          desc: 'La receta original de la casa: cerdo, langostinos y verduras salteadas a fuego alto.', price: 38, onOffer: false, offerPrice: null },
    { no: '02', name: 'Pato Pekinés',                   desc: 'Piel crocante laqueada, servido con panqueques al vapor y salsa hoisin de la casa.', price: 95, onOffer: false, offerPrice: null },
    { no: '03', name: 'Langostinos Kam Lu Wantán',       desc: 'Langostinos crocantes bañados en salsa agridulce sobre cama de wantán frito.', price: 62, onOffer: true, offerPrice: 49 },
    { no: '04', name: 'Chancho Asado a la Cantonesa',    desc: 'Marinado 24 horas, asado lento hasta dorar el borde de grasa y caramelizar la piel.', price: 48, onOffer: false, offerPrice: null },
    { no: '05', name: 'Tallarín Saltado de Mariscos',    desc: 'Fideo de huevo salteado con calamar, pulpo y langostinos al wok.', price: 56, onOffer: false, offerPrice: null },
    { no: '06', name: 'Sopa Wantán',                     desc: 'Caldo claro de cerdo y gallina con wantán relleno hecho a mano, todos los días.', price: 28, onOffer: false, offerPrice: null },
  ];
  await Dish.insertMany(dishesData);
  console.log(`  • ${dishesData.length} platos creados.`);

  console.log('\n✅ Seed completado.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error durante el seed:', err);
  process.exit(1);
});
