export type BlockedSlotScope = 'shop' | 'staff';

export type BlockedSlot = {
  id: string;
  scope: BlockedSlotScope;
  shopId: string;
  staffId?: string;
  start: string;
  end: string;
  reason: string;
};

export type CreateBlockedSlotInput = Omit<BlockedSlot, 'id'>;
export type UpdateBlockedSlotInput = Partial<CreateBlockedSlotInput>;
