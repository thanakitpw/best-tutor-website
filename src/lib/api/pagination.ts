import { z } from "zod";

/**
 * Pagination contract shared across all list endpoints.
 *
 * Query params: `?page=1&limit=12`
 * Defaults:      page=1, limit=12
 * Caps:          limit ≤ 50 (soft guard against scraping)
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
export const MAX_LIMIT = 50;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function buildPaginated<T>(
  items: T[],
  total: number,
  { page, limit }: PaginationQuery,
): Paginated<T> {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function computeSkipTake({ page, limit }: PaginationQuery) {
  return { skip: (page - 1) * limit, take: limit };
}
