import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "เปิดเร็ว ๆ นี้ | Best Tutor Thailand",
  description: "ฟีเจอร์นี้กำลังจะเปิดให้ใช้งานเร็ว ๆ นี้",
  path: "/coming-soon",
  noIndex: true,
});

export default function ComingSoonPage() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center bg-[color:var(--color-light-bg)] px-4 py-16">
      <div className="flex max-w-xl flex-col items-center gap-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
          <Clock className="size-7" />
        </span>
        <h1 className="text-3xl font-bold text-[color:var(--color-heading)] md:text-4xl">
          เปิดให้บริการเร็ว ๆ นี้
        </h1>
        <p className="text-base leading-7 text-[color:var(--color-body)]">
          ฟีเจอร์ที่คุณค้นหายังอยู่ระหว่างเตรียมเปิดให้ใช้งาน
          ในระหว่างนี้สามารถเรียกดูติวเตอร์และวิชาที่เปิดสอนได้ที่หน้าหลัก
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)]"
          >
            <Link href="/tutors">ดูติวเตอร์ทั้งหมด</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="gap-1.5">
              <ArrowLeft className="size-4" />
              กลับหน้าแรก
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
