import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../../lib/auth.js';

describe('auth helpers', () => {
  it('signs and verifies a token', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = signToken({ email: 'admin@test.pl' });
    const payload = verifyToken(token);
    expect(payload.email).toBe('admin@test.pl');
  });

  it('returns null for invalid token', () => {
    process.env.JWT_SECRET = 'test-secret';
    expect(verifyToken('bad-token')).toBeNull();
  });
});
