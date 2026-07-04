export type DailyBookingsPeriod = 7 | 30;

export type DailyBookingsPoint = {
  date: string;
  bookings: number;
  revenue: number;
};

export type DailyBookingsResponse = {
  period: DailyBookingsPeriod;
  data: DailyBookingsPoint[];
};

export type MonthlyRevenuePoint = {
  month: string;
  revenue: number;
};

export type MonthlyRevenueResponse = {
  data: MonthlyRevenuePoint[];
};

export type RankedItem = {
  id: string;
  name: string;
  value: number;
};

export type RankedItemsResponse = {
  data: RankedItem[];
};

export type CustomerGrowthPoint = {
  period: string;
  newCustomers: number;
  cumulativeCustomers: number;
};

export type CustomerGrowthResponse = {
  data: CustomerGrowthPoint[];
};

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type BookingStatusSlice = {
  status: BookingStatus;
  count: number;
};

export type BookingStatusResponse = {
  data: BookingStatusSlice[];
};
