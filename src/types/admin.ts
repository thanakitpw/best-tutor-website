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
  gender: string | null;
  email: string | null;
  phone: string | null;
  lineId: string | null;
  profileImageUrl: string | null;
  education: string | null;
  occupation: string | null;
  teachingExperience: number | null;
  teachingStyle: string | null;
  subjectsTaught: string | null;
  ratePricing: string | null;
  address: string | null;
  vehicleType: string | null;
  status: TutorStatus;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTutorsResponse {
  tutors: AdminTutor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PatchTutorStatusBody = {
  status: TutorStatus;
};
