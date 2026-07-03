export type Id = string;

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiError = {
  message: string;
  code?: string;
};
