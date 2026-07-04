import type { ShopPerformanceMetrics } from '@/features/merchant-management/types/shop-tabs';

function generatePerformanceData(days: number): ShopPerformanceMetrics {
  const data = Array.from({ length: days }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return {
      date: date.toISOString().slice(0, 10),
      bookings: Math.floor(5 + Math.random() * 15),
      revenue: Math.floor(8000 + Math.random() * 12000),
      rating: Number((4 + Math.random() * 0.8).toFixed(1)),
    };
  });
  return { period: days as 7 | 30, data };
}

export const shopPerformanceFixture: Record<string, Record<7 | 30, ShopPerformanceMetrics>> = {};

export function getPerformanceForShop(shopId: string, period: 7 | 30 = 7): ShopPerformanceMetrics {
  if (!shopPerformanceFixture[shopId]) {
    shopPerformanceFixture[shopId] = {
      7: generatePerformanceData(7),
      30: generatePerformanceData(30),
    };
  }
  return shopPerformanceFixture[shopId][period];
}
