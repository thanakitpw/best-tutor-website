/**
 * Minimal Line Messaging API client.
 *
 * Uses Push Message API (https://developers.line.biz/en/reference/messaging-api/#send-push-message).
 * Free plan allows 200 push messages/month; Light plan = 5,000/month.
 *
 * We keep the client tiny + dependency-free rather than pulling `@line/bot-sdk`
 * because we only need a single endpoint.
 */

const LINE_PUSH_ENDPOINT = "https://api.line.me/v2/bot/message/push";

export type LineTextMessage = {
  type: "text";
  text: string;
};

export type LineFlexMessage = {
  type: "flex";
  altText: string;
  contents: Record<string, unknown>;
};

export type LineMessage = LineTextMessage | LineFlexMessage;

export type PushMessageInput = {
  /** User/group/room id to receive the message. Defaults to LINE_NOTIFY_USER_ID env. */
  to?: string;
  messages: readonly LineMessage[];
};

export class LineApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Line Messaging API error (${status}): ${body}`);
    this.name = "LineApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Push one or more messages to a Line user/group/room.
 *
 * Silently no-ops if `LINE_CHANNEL_ACCESS_TOKEN` is missing — this prevents
 * accidental crashes in local dev. Returns `{ sent: false }` in that case.
 */
export async function pushLineMessage(
  input: PushMessageInput,
): Promise<{ sent: boolean; skipped?: "missing_token" | "missing_recipient" }> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[line] LINE_CHANNEL_ACCESS_TOKEN ไม่ได้ตั้งค่า — ข้ามการส่ง");
    }
    return { sent: false, skipped: "missing_token" };
  }

  const to = input.to ?? process.env.LINE_NOTIFY_USER_ID;
  if (!to) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[line] LINE_NOTIFY_USER_ID ไม่ได้ตั้งค่า — ข้ามการส่ง");
    }
    return { sent: false, skipped: "missing_recipient" };
  }

  const response = await fetch(LINE_PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, messages: input.messages }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new LineApiError(response.status, body || response.statusText);
  }

  return { sent: true };
}
