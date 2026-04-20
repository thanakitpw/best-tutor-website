import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://besttutorthailand.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Best Tutor Thailand — หาติวเตอร์ ครูสอนพิเศษตัวต่อตัว อันดับ 1 ของไทย",
    template: "%s | Best Tutor Thailand",
  },
  description:
    "แพลตฟอร์มจับคู่นักเรียนกับติวเตอร์คุณภาพ สอนพิเศษตัวต่อตัว ทั้งที่บ้านและออนไลน์ ครอบคลุมทุกวิชา — เป้าหมายของคุณ ความสำเร็จของเรา",
  keywords: [
    "หาติวเตอร์",
    "ครูสอนพิเศษ",
    "ติวเตอร์ตัวต่อตัว",
    "เรียนพิเศษออนไลน์",
    "เรียนพิเศษที่บ้าน",
    "ติวเตอร์ภาษาอังกฤษ",
    "ติวเตอร์คณิตศาสตร์",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Best Tutor Thailand",
    title: "Best Tutor Thailand — หาติวเตอร์ ครูสอนพิเศษตัวต่อตัว",
    description: "แพลตฟอร์มจับคู่นักเรียนกับติวเตอร์คุณภาพ สอนพิเศษตัวต่อตัว ทั้งที่บ้านและออนไลน์",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Tutor Thailand",
    description: "หาติวเตอร์ ครูสอนพิเศษตัวต่อตัว",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${jakarta.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
