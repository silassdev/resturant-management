import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET, ADMIN_TOKEN } = process.env;

export function adminOnly(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token && token === ADMIN_TOKEN) {
    req.user = { role: 'admin', name: 'admin-demo' };
    return next();
  }
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth header' });
  const jwtToken = parts[1];
  try {
    const payload = jwt.verify(jwtToken, JWT_SECRET);
    if (!payload || !payload.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
