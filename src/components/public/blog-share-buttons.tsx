"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface BlogShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

/**
 * Social share cluster rendered at the end of an article. We avoid loading
 * SDKs for FB/Line — direct share intent URLs keep the bundle small and
 * work on all platforms. The "Copy" button uses `navigator.clipboard` with
 * a Sonner toast for confirmation.
 */
export function BlogShareButtons({ title, url, className }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url,
  )}`;
  const lineShare = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    url,
  )}&text=${encodeURIComponent(title)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("คัดลอกลิงก์บทความแล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("คัดลอกลิงก์ไม่สำเร็จ");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({ title, url });
    } catch {
      // User canceled — no-op.
    }
  };

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)] p-3",
        className ?? "",
      ].join(" ")}
    >
      <span className="mr-1 flex items-center gap-1 px-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
        <Share2 className="size-3.5" />
        แชร์
      </span>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="h-9 gap-2 bg-white"
      >
        <a
          href={fbShare}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="แชร์ไปยัง Facebook"
        >
          <ThumbsUp className="size-4 text-[#1877F2]" />
          Facebook
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="h-9 gap-2 bg-white"
      >
        <a
          href={lineShare}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="แชร์ไปยัง LINE"
        >
          <MessageCircle className="size-4 text-[#06C755]" />
          LINE
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-9 gap-2 bg-white"
        aria-label="คัดลอกลิงก์บทความ"
      >
        {copied ? (
          <Check className="size-4 text-[color:var(--color-success)]" />
        ) : (
          <Copy className="size-4" />
        )}
        {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="h-9 gap-2 bg-white md:hidden"
        aria-label="แชร์แบบอื่น"
      >
        <Share2 className="size-4" />
        อื่น ๆ
      </Button>
    </div>
  );
}
