/**
 * Empty stub — real reviews now come from Prisma via the future
 * `/api/tutors/[slug]` endpoint. Kept as a module so any straggler imports
 * fail loudly with a clear name rather than a missing-file error.
 */

export interface ReviewItem {
  id: string;
  tutorSlug: string;
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  images: string[];
  isVerified: boolean;
  adminReply: string | null;
  createdAt: Date;
}

export interface RatingStats {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export const EMPTY_RATING_STATS: RatingStats = {
  average: 0,
  total: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};
