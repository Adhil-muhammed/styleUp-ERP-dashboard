export type StaffBreak = {
  id: string;
  shopId: string;
  staffId: string;
  start: string;
  end: string;
  label: string;
};

export type CreateStaffBreakInput = Omit<StaffBreak, 'id'>;
export type UpdateStaffBreakInput = Partial<CreateStaffBreakInput>;
