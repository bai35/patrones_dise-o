const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kammen_dev_secret_cambia_esto_en_produccion';

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware: exige que haya un token válido (cualquier rol)
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autenticado. Inicia sesión de nuevo.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesión inválida o expirada. Inicia sesión de nuevo.' });
  }
}

// Middleware: exige rol admin (se usa después de requireAuth)
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Esta acción requiere permisos de administrador.' });
  }
  next();
}

module.exports = { signToken, requireAuth, requireAdmin, JWT_SECRET };
