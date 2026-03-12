import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
