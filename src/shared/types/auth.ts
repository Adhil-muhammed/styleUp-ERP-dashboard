export type UserRole = 'super_admin' | 'shop_owner';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  merchantId: string | null;
  token: string;
};
