import type { AuthUser } from '@/shared/types/auth';

type MockUserRecord = AuthUser & { password: string };

export const mockUsersFixture: MockUserRecord[] = [
  {
    id: 'usr-admin-001',
    name: 'Platform Admin',
    email: 'admin@stylequest.in',
    password: 'admin123',
    role: 'super_admin',
    merchantId: null,
    token: 'mock-token-super-admin',
  },
  {
    id: 'usr-owner-001',
    name: 'Anjali Menon',
    email: 'owner@luxesalon.in',
    password: 'owner123',
    role: 'shop_owner',
    merchantId: 'shp-001',
    token: 'mock-token-shop-owner',
  },
];

export function findMockUserByEmail(email: string): MockUserRecord | undefined {
  return mockUsersFixture.find((user) => user.email.toLowerCase() === email.toLowerCase());
}
