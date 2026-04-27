/**
 * Public-facing tutor shapes shared between server queries and client UI.
 * Kept separate from `public.ts` because that file is `server-only` and
 * client components (forms, cards) need the type without the queries.
 */

export interface PublicTutor {
  slug: string;
  nickname: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  rating: number;
  reviewCount: number;
  subjects: string[];
  province: string | null;
  education: string;
  isPopular: boolean;
}

/** Listing variant — adds filter fields used on /subject/* pages. */
export interface ListingTutor extends PublicTutor {
  experienceYears: number;
  gender: "ชาย" | "หญิง";
}
