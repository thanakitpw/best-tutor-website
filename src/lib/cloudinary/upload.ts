import { getCloudinary } from "./config";
import type { UploadApiResponse } from "cloudinary";

/**
 * Cloudinary transform presets used across the app.
 * Public URLs built with these presets are cached at Cloudinary's CDN.
 */
export const CLOUDINARY_PRESETS = {
  /** Avatar / list thumbnail — 200x200, face-auto-cropped. */
  thumbnail: "c_fill,g_auto,w_200,h_200,q_auto,f_auto",
  /** Tutor card — 400x400. */
  card: "c_fill,g_auto,w_400,h_400,q_auto,f_auto",
  /** Hero banner — 1920x1080. */
  hero: "c_fill,g_auto,w_1920,h_1080,q_auto,f_auto",
  /** Tutor profile portrait — 600x800. */
  profile: "c_fill,g_auto,w_600,h_800,q_auto,f_auto",
} as const;

export type CloudinaryPreset = keyof typeof CLOUDINARY_PRESETS;

export type UploadFolder =
  | "tutors"
  | "tutors/profiles"
  | "articles"
  | "reviews"
  | "courses"
  | "site";

export type CloudinaryUploadOptions = {
  folder: UploadFolder;
  /** Optional public id (without extension). If omitted, Cloudinary generates one. */
  publicId?: string;
  /** If true, overwrite an existing asset with the same public id. */
  overwrite?: boolean;
  /** Extra tags stored alongside the asset. */
  tags?: string[];
};

export type CloudinaryUploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: string;
};

/**
 * Upload a file (Buffer | data URI string) to Cloudinary from the server.
 *
 * Prefer this over client-side signed uploads for internal admin tooling —
 * it keeps the API key off the browser and lets us tag/folder consistently.
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: CloudinaryUploadOptions,
): Promise<CloudinaryUploadResult> {
  const cloudinary = getCloudinary();

  const dataUri =
    typeof file === "string" ? file : `data:application/octet-stream;base64,${file.toString("base64")}`;

  const response: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder: `besttutor/${options.folder}`,
    public_id: options.publicId,
    overwrite: options.overwrite ?? false,
    resource_type: "auto",
    tags: options.tags,
  });

  return {
    url: response.url,
    secureUrl: response.secure_url,
    publicId: response.public_id,
    width: response.width,
    height: response.height,
    format: response.format,
    bytes: response.bytes,
    resourceType: response.resource_type,
  };
}

/**
 * Build a delivery URL with a named transform preset applied.
 * Example:
 *   buildCloudinaryUrl("besttutor/tutors/abc123", "thumbnail")
 *     → https://res.cloudinary.com/<cloud>/image/upload/c_fill,g_auto.../besttutor/tutors/abc123
 */
export function buildCloudinaryUrl(publicId: string, preset: CloudinaryPreset): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ไม่ได้ตั้งค่า");
  }
  const transform = CLOUDINARY_PRESETS[preset];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}

/**
 * Delete an asset by public id. Useful for cascade-deleting tutor profile images.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
