"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { ArticleCard } from "@/components/public/article-card";
import { EmptyState } from "@/components/public/empty-state";
import { Pagination } from "@/components/public/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { MockArticle } from "./mock-articles";

interface BlogSearchProps {
  articles: MockArticle[];
  /** Category label used in the "no results" state. */
  categoryLabel?: string;
  /** Articles displayed per page before pagination kicks in. */
  pageSize?: number;
  /** If true, render the first result as a larger feature card. */
  showFeature?: boolean;
}

/**
 * Client-side article grid with free-text search and pagination. Runs
 * entirely in-memory because the seed dataset is small (~12 articles). When
 * the DB has 100+ articles, swap this for a server-driven search endpoint.
 */
export function BlogSearch({
  articles,
  categoryLabel,
  pageSize = 9,
  showFeature = true,
}: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [articles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  // Feature card only on page 1 + when not searching, to keep pagination
  // predictable (otherwise page size changes mid-search).
  const isFeatureShown =
    showFeature && query === "" && currentPage === 1 && filtered.length > 0;
  const feature = isFeatureShown ? filtered[0] : undefined;
  const rest = isFeatureShown ? filtered.slice(1) : filtered;

  const restStart = (currentPage - 1) * pageSize;
  const pageItems = rest.slice(restStart, restStart + pageSize);

  const handleReset = () => {
    setQuery("");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted)]"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาบทความ..."
            className="h-11 pl-9 pr-9"
            aria-label="ค้นหาบทความ"
          />
          {query && (
            <button
              type="button"
              aria-label="ล้างการค้นหา"
              onClick={handleReset}
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--color-muted)] hover:bg-[color:var(--color-alt-bg)] hover:text-[color:var(--color-heading)]"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm text-[color:var(--color-muted)] sm:shrink-0">
          พบ {filtered.length.toLocaleString("th-TH")} บทความ
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="ไม่พบบทความที่ตรงกับคำค้นหา"
          description={
            categoryLabel
              ? `ลองเปลี่ยนคำค้นหาหรือเลือกดูบทความหมวดอื่น (ปัจจุบัน: ${categoryLabel})`
              : "ลองเปลี่ยนคำค้นหาใหม่ หรือเลือกดูบทความทั้งหมด"
          }
          secondaryAction={{ label: "ล้างการค้นหา", onClick: handleReset }}
        />
      ) : (
        <>
          {feature && (
            <div className="mb-2">
              <ArticleCard
                article={toCardData(feature)}
                variant="feature"
              />
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((article) => (
              <ArticleCard
                key={article.slug}
                article={toCardData(article)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(next) => {
                  setPage(next);
                  // Scroll grid into view for ergonomic pagination on mobile.
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 280, behavior: "smooth" });
                  }
                }}
              />
            </div>
          )}
        </>
      )}

      {filtered.length > 0 && totalPages === 1 && query !== "" && (
        <div className="flex items-center justify-center">
          <Button variant="outline" size="sm" onClick={handleReset}>
            ล้างการค้นหาเพื่อดูบทความทั้งหมด
          </Button>
        </div>
      )}
    </div>
  );
}

function toCardData(article: MockArticle) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    featuredImageUrl: article.featuredImageUrl,
    category: article.category,
    publishedAt: article.publishedAt,
    readTimeMinutes: article.readTimeMinutes,
    imageAlt: article.imageAlt,
  };
}
