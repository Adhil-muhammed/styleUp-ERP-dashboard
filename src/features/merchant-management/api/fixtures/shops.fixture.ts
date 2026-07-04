import type { ShopListItem } from '@/features/merchant-management/types/shop';

export const SHOP_CITIES = ['Kochi', 'Ernakulam', 'Kakkanad', 'Edappally', 'Kaloor', 'Thrippunithura'] as const;

export const shopsFixture: ShopListItem[] = [
  { id: 'shp-001', shopName: 'Luxe Salon Kochi', ownerName: 'Anjali Menon', rating: 4.8, status: 'approved', city: 'Kochi', activeServices: 24, activeStaff: 8, isFeatured: true },
  { id: 'shp-002', shopName: 'Glow Studio Edappally', ownerName: 'Rahul Nair', rating: 4.5, status: 'approved', city: 'Edappally', activeServices: 18, activeStaff: 5, isFeatured: false },
  { id: 'shp-003', shopName: 'StyleQuest MG Road', ownerName: 'Priya Thomas', rating: 4.9, status: 'approved', city: 'Kochi', activeServices: 32, activeStaff: 12, isFeatured: true },
  { id: 'shp-004', shopName: 'Urban Cuts Kaloor', ownerName: 'Arjun Pillai', rating: 4.2, status: 'pending', city: 'Kaloor', activeServices: 12, activeStaff: 4, isFeatured: false },
  { id: 'shp-005', shopName: 'Bloom Beauty Kakkanad', ownerName: 'Meera Krishnan', rating: 4.6, status: 'approved', city: 'Kakkanad', activeServices: 20, activeStaff: 6, isFeatured: false },
  { id: 'shp-006', shopName: 'Serene Spa Ernakulam', ownerName: 'Vivek Das', rating: 4.7, status: 'suspended', city: 'Ernakulam', activeServices: 15, activeStaff: 5, isFeatured: false },
  { id: 'shp-007', shopName: 'Classic Barbers Thrippunithura', ownerName: 'Sneha Raj', rating: 4.1, status: 'pending', city: 'Thrippunithura', activeServices: 8, activeStaff: 3, isFeatured: false },
  { id: 'shp-008', shopName: 'Radiance Hair Kochi', ownerName: 'Kiran Varma', rating: 3.9, status: 'rejected', city: 'Kochi', activeServices: 0, activeStaff: 0, isFeatured: false },
  { id: 'shp-009', shopName: 'Elite Grooming Edappally', ownerName: 'Deepa Mohan', rating: 4.4, status: 'approved', city: 'Edappally', activeServices: 16, activeStaff: 5, isFeatured: false },
  { id: 'shp-010', shopName: 'Pure Skin Kakkanad', ownerName: 'Nikhil Babu', rating: 4.3, status: 'pending', city: 'Kakkanad', activeServices: 14, activeStaff: 4, isFeatured: false },
  { id: 'shp-011', shopName: 'Velvet Touch Kochi', ownerName: 'Lakshmi Suresh', rating: 4.6, status: 'approved', city: 'Kochi', activeServices: 22, activeStaff: 7, isFeatured: true },
  { id: 'shp-012', shopName: 'Fresh Fade Kaloor', ownerName: 'George Mathew', rating: 4.0, status: 'approved', city: 'Kaloor', activeServices: 10, activeStaff: 3, isFeatured: false },
  { id: 'shp-013', shopName: 'Bliss Wellness Ernakulam', ownerName: 'Reshma Paul', rating: 4.5, status: 'approved', city: 'Ernakulam', activeServices: 19, activeStaff: 6, isFeatured: false },
  { id: 'shp-014', shopName: 'Chic Cuts Edappally', ownerName: 'Adithyan S', rating: 3.8, status: 'suspended', city: 'Edappally', activeServices: 11, activeStaff: 4, isFeatured: false },
  { id: 'shp-015', shopName: 'Glow Up Kakkanad', ownerName: 'Divya Ramesh', rating: 4.7, status: 'approved', city: 'Kakkanad', activeServices: 26, activeStaff: 9, isFeatured: false },
  { id: 'shp-016', shopName: 'Heritage Salon Kochi', ownerName: 'Manu Jose', rating: 4.2, status: 'pending', city: 'Kochi', activeServices: 13, activeStaff: 4, isFeatured: false },
  { id: 'shp-017', shopName: 'Studio 9 Thrippunithura', ownerName: 'Neha Sharma', rating: 4.4, status: 'approved', city: 'Thrippunithura', activeServices: 17, activeStaff: 5, isFeatured: false },
  { id: 'shp-018', shopName: 'Mirror Mirror Kaloor', ownerName: 'Tom Cherian', rating: 4.1, status: 'approved', city: 'Kaloor', activeServices: 9, activeStaff: 3, isFeatured: false },
  { id: 'shp-019', shopName: 'Aura Beauty Ernakulam', ownerName: 'Keerthi V', rating: 4.8, status: 'approved', city: 'Ernakulam', activeServices: 28, activeStaff: 10, isFeatured: true },
  { id: 'shp-020', shopName: 'Trend Setters Kochi', ownerName: 'Roshni P', rating: 3.7, status: 'rejected', city: 'Kochi', activeServices: 0, activeStaff: 0, isFeatured: false },
  { id: 'shp-021', shopName: 'Polish & Prose Edappally', ownerName: 'Harish Kumar', rating: 4.3, status: 'approved', city: 'Edappally', activeServices: 15, activeStaff: 5, isFeatured: false },
  { id: 'shp-022', shopName: 'Silk & Shears Kakkanad', ownerName: 'Amrita Das', rating: 4.5, status: 'pending', city: 'Kakkanad', activeServices: 11, activeStaff: 4, isFeatured: false },
  { id: 'shp-023', shopName: 'Golden Comb Kochi', ownerName: 'Binu Raj', rating: 4.0, status: 'approved', city: 'Kochi', activeServices: 14, activeStaff: 4, isFeatured: false },
  { id: 'shp-024', shopName: 'Zen Spa Kaloor', ownerName: 'Christy John', rating: 4.6, status: 'approved', city: 'Kaloor', activeServices: 21, activeStaff: 7, isFeatured: false },
  { id: 'shp-025', shopName: 'Nova Nails Ernakulam', ownerName: 'Faisal Khan', rating: 4.2, status: 'approved', city: 'Ernakulam', activeServices: 12, activeStaff: 4, isFeatured: false },
];
