/**
 * Slug utilities.
 *
 * Thai → latin transliteration follows a pragmatic RTGS-inspired mapping
 * good enough for URLs. If the result is empty (e.g. unmapped chars only)
 * the caller should append a random suffix.
 *
 * This is intentionally deterministic + zero-dep; ICU/uninorm would be
 * heavier than this URL-path use case warrants.
 *
 * Note: all keys are quoted strings because TypeScript won't accept Thai
 * combining marks (tone marks / sara-i etc.) as bare identifiers.
 */

// Royal Thai General System of Transcription (RTGS)-ish mapping.
// Covers the common phonetic letters + vowels; fine-tune as real tutor
// names surface edge cases.
const THAI_MAP: Record<string, string> = {
  // Consonants
  "ก": "k", "ข": "kh", "ฃ": "kh", "ค": "kh", "ฅ": "kh", "ฆ": "kh",
  "ง": "ng",
  "จ": "ch", "ฉ": "ch", "ช": "ch", "ซ": "s", "ฌ": "ch",
  "ญ": "y",
  "ฎ": "d", "ฏ": "t", "ฐ": "th", "ฑ": "th", "ฒ": "th", "ณ": "n",
  "ด": "d", "ต": "t", "ถ": "th", "ท": "th", "ธ": "th", "น": "n",
  "บ": "b", "ป": "p", "ผ": "ph", "ฝ": "f", "พ": "ph", "ฟ": "f", "ภ": "ph",
  "ม": "m",
  "ย": "y",
  "ร": "r", "ล": "l", "ว": "w",
  "ศ": "s", "ษ": "s", "ส": "s",
  "ห": "h", "ฬ": "l",
  "อ": "",
  "ฮ": "h",
  // Vowels (short + long collapsed to closest sound)
  "ะ": "a", "ั": "a", "า": "a",
  "ำ": "am",
  "ิ": "i", "ี": "i",
  "ึ": "ue", "ื": "ue",
  "ุ": "u", "ู": "u",
  "เ": "e", "แ": "ae", "โ": "o", "ใ": "ai", "ไ": "ai",
  "ๅ": "a",
  "ฯ": "",
  "ๆ": "",
  // Tone marks + misc — drop
  "่": "", "้": "", "๊": "", "๋": "", "์": "", "็": "",
  // Thai digits
  "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4",
  "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9",
};

function transliterateThai(input: string): string {
  let out = "";
  for (const ch of input) {
    if (Object.prototype.hasOwnProperty.call(THAI_MAP, ch)) {
      out += THAI_MAP[ch];
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Convert an arbitrary (Thai/English/mixed) string into a URL-safe slug.
 * Lowercase, hyphenated, ASCII-only. Returns empty string if no usable chars.
 */
export function slugify(input: string): string {
  const transliterated = transliterateThai(input);
  return transliterated
    .normalize("NFKD")
    // strip combining diacritics
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    // replace non-alphanumeric with hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // trim hyphens
    .replace(/^-+|-+$/g, "")
    // collapse repeats
    .replace(/-{2,}/g, "-");
}

/**
 * Build a candidate slug from multiple parts; falls back to `fallback`
 * (or a short random id) if all parts transliterate to empty.
 */
export function buildSlug(
  parts: ReadonlyArray<string | null | undefined>,
  fallback?: string,
): string {
  const joined = parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .join(" ");
  const slug = slugify(joined);
  if (slug) return slug;
  if (fallback) {
    const fallbackSlug = slugify(fallback);
    if (fallbackSlug) return fallbackSlug;
  }
  return randomSuffix(8);
}

/**
 * Ensure a slug is unique given an async existence checker.
 * Appends `-2`, `-3`, ... until unused, or a random suffix after 20 tries.
 */
export async function ensureUniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const trimmed = base || randomSuffix(8);
  if (!(await exists(trimmed))) return trimmed;
  for (let i = 2; i <= 20; i += 1) {
    const candidate = `${trimmed}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${trimmed}-${randomSuffix(6)}`;
}

function randomSuffix(length: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
