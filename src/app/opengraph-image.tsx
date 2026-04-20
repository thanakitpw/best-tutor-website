import { ImageResponse } from "next/og";

import {
  BRAND_COLOR_PRIMARY,
  BRAND_COLOR_PRIMARY_HOVER,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo/site-metadata";

// Next.js route segment config — fixes dimensions + content type.
export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
} as const;

// Google Fonts URL for Noto Sans Thai — fetched at build/request time and
// embedded into the ImageResponse so Thai glyphs render correctly.
const NOTO_SANS_THAI_BOLD =
  "https://fonts.gstatic.com/s/notosansthai/v26/iJWQBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzD-QRw6.ttf";
const NOTO_SANS_THAI_REGULAR =
  "https://fonts.gstatic.com/s/notosansthai/v26/iJWQBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtozD-QRw6.ttf";

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load font: ${url} (${res.status})`);
  }
  return res.arrayBuffer();
}

export default async function Image() {
  const [boldFont, regularFont] = await Promise.all([
    loadFont(NOTO_SANS_THAI_BOLD),
    loadFont(NOTO_SANS_THAI_REGULAR),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "#ffffff",
          background: `linear-gradient(135deg, ${BRAND_COLOR_PRIMARY} 0%, ${BRAND_COLOR_PRIMARY_HOVER} 100%)`,
          fontFamily: "'Noto Sans Thai'",
        }}
      >
        {/* Top row — brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        {/* Center — tagline block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 400,
              opacity: 0.9,
              lineHeight: 1.4,
            }}
          >
            แพลตฟอร์มจับคู่นักเรียนกับติวเตอร์คุณภาพ สอนพิเศษตัวต่อตัวทั่วไทย
          </div>
        </div>

        {/* Bottom — CTA pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px 36px",
              background: "#ffffff",
              color: BRAND_COLOR_PRIMARY,
              borderRadius: "999px",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            หาครูสอนพิเศษ →
          </div>
          <div
            style={{
              fontSize: "22px",
              opacity: 0.85,
            }}
          >
            besttutorthailand.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans Thai",
          data: boldFont,
          style: "normal",
          weight: 700,
        },
        {
          name: "Noto Sans Thai",
          data: regularFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
