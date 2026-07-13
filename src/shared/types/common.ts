export type Id = string;

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type CursorPageMeta = {
  nextCursor: string | null;
  hasMore: boolean;
};

export type CursorPaginatedResponse<T> = {
  items: T[];
  page: CursorPageMeta;
};

export type ApiError = {
  message: string;
  code?: string;
};
