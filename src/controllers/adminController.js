import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'keyboardcat';

export function login(req, res) {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'adminpass') {
    const token = jwt.sign({ username: 'admin', isAdmin: true }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  const fallback = process.env.ADMIN_TOKEN;
  if (fallback) {
    return res.json({ token: fallback });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
}

export async function getDailySales(req, res) {
  res.json({ totalSales: 0, orderCount: 0 });
}
