export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  items: T;
  pagination: Pagination;
}

export class PaginationParams {
  pageNumber = 1;
  pageSize = 5;
}