import { z } from "zod";
import { pushLineMessage, type LineFlexMessage } from "./client";

/**
 * Typed notification helpers. Each one:
 * - validates input with Zod (defensive — these run near the form boundary)
 * - builds a Flex message body (preferred for richer visuals)
 * - falls back to a plain text altText for older clients / notifications
 */

const leadSchema = z.object({
  fullName: z.string().min(1),
  subjectCategory: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  phone: z.string().min(1),
  province: z.string().optional().nullable(),
});

export type NewLeadPayload = z.infer<typeof leadSchema>;

export async function notifyNewLead(input: NewLeadPayload) {
  const data = leadSchema.parse(input);

  const lines = [
    "🆕 Lead ใหม่จากเว็บไซต์",
    `ชื่อ: ${data.fullName}`,
    data.subjectCategory ? `หมวด: ${data.subjectCategory}` : null,
    data.subject ? `วิชา: ${data.subject}` : null,
    `โทร: ${data.phone}`,
    data.province ? `จังหวัด: ${data.province}` : null,
  ].filter((line): line is string => Boolean(line));

  const altText = lines.join("\n");

  const flex: LineFlexMessage = {
    type: "flex",
    altText,
    contents: buildLeadFlexBubble({
      title: "🆕 Lead ใหม่",
      rows: [
        { label: "ชื่อ", value: data.fullName },
        { label: "หมวดวิชา", value: data.subjectCategory ?? "-" },
        { label: "วิชา", value: data.subject ?? "-" },
        { label: "โทร", value: data.phone },
        { label: "จังหวัด", value: data.province ?? "-" },
      ],
      accentHex: "#046bd2",
    }),
  };

  return pushLineMessage({ messages: [flex] });
}

const tutorRegistrationSchema = z.object({
  nickname: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  subjectsTaught: z.string().optional().nullable(),
});

export type NewTutorRegistrationPayload = z.infer<typeof tutorRegistrationSchema>;

export async function notifyNewTutorRegistration(
  input: NewTutorRegistrationPayload,
) {
  const data = tutorRegistrationSchema.parse(input);
  const displayName = `${data.nickname} (${data.firstName} ${data.lastName})`;

  const altText = [
    "🧑‍🏫 ติวเตอร์สมัครใหม่",
    `ชื่อ: ${displayName}`,
    `โทร: ${data.phone}`,
    data.subjectsTaught ? `สอน: ${data.subjectsTaught}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  const flex: LineFlexMessage = {
    type: "flex",
    altText,
    contents: buildLeadFlexBubble({
      title: "🧑‍🏫 ติวเตอร์สมัครใหม่",
      rows: [
        { label: "ชื่อ", value: displayName },
        { label: "โทร", value: data.phone },
        { label: "สอน", value: data.subjectsTaught ?? "-" },
      ],
      accentHex: "#0693e3",
    }),
  };

  return pushLineMessage({ messages: [flex] });
}

const reviewSchema = z.object({
  tutorName: z.string().min(1),
  reviewerName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export type NewReviewPayload = z.infer<typeof reviewSchema>;

export async function notifyNewReview(input: NewReviewPayload) {
  const data = reviewSchema.parse(input);

  const altText = [
    "⭐ รีวิวใหม่",
    `ติวเตอร์: ${data.tutorName}`,
    `โดย: ${data.reviewerName}`,
    `คะแนน: ${"⭐".repeat(data.rating)} (${data.rating}/5)`,
    data.comment ? `ข้อความ: ${data.comment}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  const flex: LineFlexMessage = {
    type: "flex",
    altText,
    contents: buildLeadFlexBubble({
      title: "⭐ รีวิวใหม่",
      rows: [
        { label: "ติวเตอร์", value: data.tutorName },
        { label: "โดย", value: data.reviewerName },
        { label: "คะแนน", value: `${"⭐".repeat(data.rating)} (${data.rating}/5)` },
        { label: "ข้อความ", value: data.comment ?? "-" },
      ],
      accentHex: "#f59e0b",
    }),
  };

  return pushLineMessage({ messages: [flex] });
}

/**
 * Build a compact Flex bubble with a title + key/value rows.
 * Ref: https://developers.line.biz/flex-simulator/
 */
function buildLeadFlexBubble(args: {
  title: string;
  rows: readonly { label: string; value: string }[];
  accentHex: string;
}): Record<string, unknown> {
  return {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box",
      layout: "vertical",
      backgroundColor: args.accentHex,
      paddingAll: "12px",
      contents: [
        {
          type: "text",
          text: args.title,
          color: "#ffffff",
          weight: "bold",
          size: "md",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      paddingAll: "12px",
      contents: args.rows.map((row) => ({
        type: "box",
        layout: "baseline",
        spacing: "sm",
        contents: [
          {
            type: "text",
            text: row.label,
            color: "#64748b",
            size: "sm",
            flex: 2,
          },
          {
            type: "text",
            text: row.value,
            color: "#1e293b",
            size: "sm",
            flex: 5,
            wrap: true,
          },
        ],
      })),
    },
  };
}
