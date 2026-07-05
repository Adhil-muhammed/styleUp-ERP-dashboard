import type { StaffListItem } from '@/features/staff-management/types/staff';

const shopNames: Record<string, string> = {
  'shp-001': 'Luxe Salon Kochi',
  'shp-002': 'Glow Studio Edappally',
  'shp-003': 'StyleQuest MG Road',
  'shp-004': 'Urban Cuts Kaloor',
};

function staff(
  id: string,
  merchantId: keyof typeof shopNames,
  name: string,
  role: StaffListItem['role'],
  rating: number,
  availability: StaffListItem['availability'],
  status: StaffListItem['status'],
  email: string,
  phone: string,
): StaffListItem {
  return {
    id,
    merchantId,
    shopName: shopNames[merchantId],
    name,
    email,
    phone,
    role,
    rating,
    availability,
    status,
  };
}

export const staffFixture: StaffListItem[] = [
  staff('stf-001', 'shp-001', 'Sreeja K', 'senior_stylist', 4.8, 'available', 'active', 'sreeja@luxesalon.in', '+91 98470 10001'),
  staff('stf-002', 'shp-001', 'Jithin M', 'barber', 4.5, 'busy', 'active', 'jithin@luxesalon.in', '+91 98470 10002'),
  staff('stf-003', 'shp-001', 'Arya P', 'beautician', 4.6, 'available', 'active', 'arya@luxesalon.in', '+91 98470 10003'),
  staff('stf-004', 'shp-001', 'Renjith T', 'receptionist', 4.2, 'off', 'active', 'renjith@luxesalon.in', '+91 98470 10004'),
  staff('stf-005', 'shp-001', 'Meera Nair', 'stylist', 4.4, 'available', 'active', 'meera@luxesalon.in', '+91 98470 10005'),
  staff('stf-006', 'shp-001', 'Arun Das', 'manager', 4.7, 'busy', 'active', 'arun@luxesalon.in', '+91 98470 10006'),
  staff('stf-007', 'shp-002', 'Divya Ramesh', 'stylist', 4.7, 'available', 'inactive', 'divya@glowstudio.in', '+91 98470 20001'),
  staff('stf-008', 'shp-002', 'Harish Kumar', 'barber', 4.3, 'available', 'active', 'harish@glowstudio.in', '+91 98470 20002'),
  staff('stf-009', 'shp-002', 'Neha Sharma', 'beautician', 4.5, 'busy', 'active', 'neha@glowstudio.in', '+91 98470 20003'),
  staff('stf-010', 'shp-002', 'Tom Cherian', 'receptionist', 4.1, 'off', 'active', 'tom@glowstudio.in', '+91 98470 20004'),
  staff('stf-011', 'shp-002', 'Lakshmi Suresh', 'senior_stylist', 4.9, 'available', 'active', 'lakshmi@glowstudio.in', '+91 98470 20005'),
  staff('stf-012', 'shp-003', 'Priya Thomas', 'manager', 4.6, 'available', 'active', 'priya@stylequest.in', '+91 98470 30001'),
  staff('stf-013', 'shp-003', 'Kiran Varma', 'stylist', 4.2, 'busy', 'active', 'kiran@stylequest.in', '+91 98470 30002'),
  staff('stf-014', 'shp-003', 'Reshma Paul', 'beautician', 4.8, 'available', 'active', 'reshma@stylequest.in', '+91 98470 30003'),
  staff('stf-015', 'shp-003', 'George Mathew', 'barber', 4.0, 'off', 'active', 'george@stylequest.in', '+91 98470 30004'),
  staff('stf-016', 'shp-003', 'Christy John', 'receptionist', 4.3, 'available', 'inactive', 'christy@stylequest.in', '+91 98470 30005'),
  staff('stf-017', 'shp-004', 'Manu Jose', 'senior_stylist', 4.5, 'available', 'active', 'manu@urbancuts.in', '+91 98470 40001'),
  staff('stf-018', 'shp-004', 'Sneha Raj', 'stylist', 4.1, 'busy', 'active', 'sneha@urbancuts.in', '+91 98470 40002'),
  staff('stf-019', 'shp-004', 'Vivek Das', 'barber', 4.4, 'available', 'active', 'vivek@urbancuts.in', '+91 98470 40003'),
  staff('stf-020', 'shp-004', 'Amrita Das', 'beautician', 4.6, 'off', 'active', 'amrita@urbancuts.in', '+91 98470 40004'),
  staff('stf-021', 'shp-001', 'Binu Raj', 'stylist', 3.9, 'available', 'inactive', 'binu@luxesalon.in', '+91 98470 10007'),
  staff('stf-022', 'shp-002', 'Faisal Khan', 'barber', 4.0, 'busy', 'inactive', 'faisal@glowstudio.in', '+91 98470 20006'),
];

export const STAFF_SKILL_CATALOG = [
  { id: 'skl-001', name: 'Haircut & Styling', category: 'Hair' },
  { id: 'skl-002', name: 'Hair Colour', category: 'Hair' },
  { id: 'skl-003', name: 'Beard Trim', category: 'Grooming' },
  { id: 'skl-004', name: 'Facial Treatment', category: 'Skin' },
  { id: 'skl-005', name: 'Manicure', category: 'Nails' },
  { id: 'skl-006', name: 'Bridal Makeup', category: 'Makeup' },
  { id: 'skl-007', name: 'Spa Massage', category: 'Wellness' },
  { id: 'skl-008', name: 'Keratin Treatment', category: 'Hair' },
] as const;

export function getShopName(merchantId: string): string {
  return shopNames[merchantId] ?? 'Unknown Shop';
}
