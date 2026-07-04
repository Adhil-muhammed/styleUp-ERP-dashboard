import type {
  BookingStatusResponse,
  CustomerGrowthResponse,
  DailyBookingsResponse,
  MonthlyRevenueResponse,
  RankedItemsResponse,
} from '@/features/dashboard/types/dashboard-charts';

export const dailyBookings7Fixture: DailyBookingsResponse = {
  period: 7,
  data: [
    { date: '2026-06-28', bookings: 198, revenue: 1_42_000 },
    { date: '2026-06-29', bookings: 215, revenue: 1_58_400 },
    { date: '2026-06-30', bookings: 231, revenue: 1_72_800 },
    { date: '2026-07-01', bookings: 189, revenue: 1_38_600 },
    { date: '2026-07-02', bookings: 256, revenue: 1_94_200 },
    { date: '2026-07-03', bookings: 278, revenue: 2_08_500 },
    { date: '2026-07-04', bookings: 247, revenue: 1_85_400 },
  ],
};

export const dailyBookings30Fixture: DailyBookingsResponse = {
  period: 30,
  data: [
    { date: '2026-06-05', bookings: 172, revenue: 1_28_400 },
    { date: '2026-06-06', bookings: 185, revenue: 1_35_200 },
    { date: '2026-06-07', bookings: 198, revenue: 1_42_000 },
    { date: '2026-06-08', bookings: 164, revenue: 1_18_600 },
    { date: '2026-06-09', bookings: 178, revenue: 1_26_800 },
    { date: '2026-06-10', bookings: 192, revenue: 1_38_400 },
    { date: '2026-06-11', bookings: 205, revenue: 1_48_200 },
    { date: '2026-06-12', bookings: 218, revenue: 1_58_600 },
    { date: '2026-06-13', bookings: 224, revenue: 1_64_800 },
    { date: '2026-06-14', bookings: 210, revenue: 1_52_400 },
    { date: '2026-06-15', bookings: 196, revenue: 1_44_200 },
    { date: '2026-06-16', bookings: 188, revenue: 1_36_800 },
    { date: '2026-06-17', bookings: 201, revenue: 1_46_600 },
    { date: '2026-06-18', bookings: 214, revenue: 1_56_400 },
    { date: '2026-06-19', bookings: 228, revenue: 1_68_200 },
    { date: '2026-06-20', bookings: 235, revenue: 1_74_600 },
    { date: '2026-06-21', bookings: 222, revenue: 1_62_800 },
    { date: '2026-06-22', bookings: 208, revenue: 1_50_400 },
    { date: '2026-06-23', bookings: 195, revenue: 1_42_600 },
    { date: '2026-06-24', bookings: 203, revenue: 1_48_800 },
    { date: '2026-06-25', bookings: 216, revenue: 1_58_200 },
    { date: '2026-06-26', bookings: 229, revenue: 1_68_400 },
    { date: '2026-06-27', bookings: 241, revenue: 1_78_600 },
    { date: '2026-06-28', bookings: 198, revenue: 1_42_000 },
    { date: '2026-06-29', bookings: 215, revenue: 1_58_400 },
    { date: '2026-06-30', bookings: 231, revenue: 1_72_800 },
    { date: '2026-07-01', bookings: 189, revenue: 1_38_600 },
    { date: '2026-07-02', bookings: 256, revenue: 1_94_200 },
    { date: '2026-07-03', bookings: 278, revenue: 2_08_500 },
    { date: '2026-07-04', bookings: 247, revenue: 1_85_400 },
  ],
};

export const monthlyRevenueFixture: MonthlyRevenueResponse = {
  data: [
    { month: '2025-08', revenue: 28_40_000 },
    { month: '2025-09', revenue: 31_20_000 },
    { month: '2025-10', revenue: 33_85_000 },
    { month: '2025-11', revenue: 35_10_000 },
    { month: '2025-12', revenue: 38_60_000 },
    { month: '2026-01', revenue: 36_20_000 },
    { month: '2026-02', revenue: 34_80_000 },
    { month: '2026-03', revenue: 37_50_000 },
    { month: '2026-04', revenue: 39_20_000 },
    { month: '2026-05', revenue: 40_10_000 },
    { month: '2026-06', revenue: 41_85_000 },
    { month: '2026-07', revenue: 42_75_000 },
  ],
};

export const topServicesFixture: RankedItemsResponse = {
  data: [
    { id: 'svc-1', name: 'Haircut & Styling', value: 1842 },
    { id: 'svc-2', name: 'Hair Colour', value: 956 },
    { id: 'svc-3', name: 'Keratin Treatment', value: 624 },
    { id: 'svc-4', name: 'Bridal Makeup', value: 412 },
    { id: 'svc-5', name: 'Manicure & Pedicure', value: 387 },
  ],
};

export const topShopsFixture: RankedItemsResponse = {
  data: [
    { id: 'shop-1', name: 'Luxe Salon Kochi', value: 1240 },
    { id: 'shop-2', name: 'Glow Studio Edappally', value: 986 },
    { id: 'shop-3', name: 'StyleQuest MG Road', value: 854 },
    { id: 'shop-4', name: 'Bloom Beauty Kakkanad', value: 712 },
    { id: 'shop-5', name: 'Urban Cuts Kaloor', value: 638 },
  ],
};

export const customerGrowthFixture: CustomerGrowthResponse = {
  data: [
    { period: '2026-02', newCustomers: 820, cumulativeCustomers: 10_240 },
    { period: '2026-03', newCustomers: 945, cumulativeCustomers: 11_185 },
    { period: '2026-04', newCustomers: 1020, cumulativeCustomers: 12_205 },
    { period: '2026-05', newCustomers: 890, cumulativeCustomers: 13_095 },
    { period: '2026-06', newCustomers: 980, cumulativeCustomers: 14_075 },
    { period: '2026-07', newCustomers: 375, cumulativeCustomers: 14_450 },
  ],
};

export const bookingStatusFixture: BookingStatusResponse = {
  data: [
    { status: 'confirmed', count: 1034 },
    { status: 'completed', count: 8420 },
    { status: 'cancelled', count: 312 },
    { status: 'no_show', count: 89 },
  ],
};
