import { findOne } from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export default { login };
