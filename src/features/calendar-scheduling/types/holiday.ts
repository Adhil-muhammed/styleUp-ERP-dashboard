export type HolidayScope = 'shop' | 'staff';

export type Holiday = {
  id: string;
  scope: HolidayScope;
  shopId: string;
  staffId?: string;
  name: string;
  startDate: string;
  endDate: string;
  recurringYearly: boolean;
};

export type CreateHolidayInput = Omit<Holiday, 'id'>;
export type UpdateHolidayInput = Partial<CreateHolidayInput>;

export type HolidayConflict = {
  bookingId: string;
  customerName: string;
  scheduledAt: string;
};
