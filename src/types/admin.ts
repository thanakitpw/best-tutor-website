/**
 * Shared types for the Admin panel.
 * These mirror the API response shapes from /api/admin/tutors.
 */

export type TutorStatus = "PENDING" | "APPROVED" | "REJECTED" | "INACTIVE";

export interface AdminTutor {
  id: string;
  slug: string;
  nickname: string | null;
  firstName: string;
  lastName: string;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  lineId?: string | null;
  profileImageUrl?: string | null;
  education?: string | null;
  occupation?: string | null;
  teachingExperienceYears: number;
  teachingStyle?: string | null;
  subjectsTaught: string | null;
  ratePricing?: string | null;
  address: string | null;
  vehicleType?: string | null;
  status: TutorStatus;
  isPopular: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Inner data shape returned by GET /api/admin/tutors after unwrapping
 * the standard `{ ok: true, data }` envelope.
 */
export interface AdminTutorsResponse {
  items: AdminTutor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Standard envelope used by every API route. */
export type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type PatchTutorStatusBody = {
  status: TutorStatus;
};
