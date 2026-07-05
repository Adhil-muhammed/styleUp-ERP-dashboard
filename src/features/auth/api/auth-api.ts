/**
 * Auth API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - POST /auth/login
 * - POST /auth/logout
 * - GET  /auth/me
 */
import { findMockUserByEmail } from '@/features/auth/api/fixtures/users.fixture';
import { mockDelay } from '@/shared/lib/mock-delay';
import type { AuthUser } from '@/shared/types/auth';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function mockLogin(email: string, password: string): Promise<AuthUser> {
  const record = findMockUserByEmail(email);

  await mockDelay(null, 400);

  if (!record || record.password !== password) {
    throw new AuthError('Invalid email or password');
  }

  const user: AuthUser = {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    merchantId: record.merchantId,
    token: record.token,
  };

  return user;
}
