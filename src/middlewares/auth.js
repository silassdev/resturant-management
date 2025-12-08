import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET, ADMIN_TOKEN } = process.env;


export function auth(requiredRole) {
  return (req, res, next) => {
    try {
      const adminToken = req.headers['x-admin-token'];
      if (adminToken && ADMIN_TOKEN && adminToken === ADMIN_TOKEN) {
        req.user = { role: 'admin', method: 'admin-token' };
        if (!requiredRole || requiredRole === 'admin') return next();
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        if (req.user) return next();
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid auth header' });
      }

      const token = parts[1];
      let payload;
      try {
        payload = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = payload;

      if (requiredRole === 'admin' && !payload?.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: admin role required' });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}


export const adminOnly = auth('admin');
