"use client";

import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TutorProfileTabsProps {
  reviewCount: number;
  about: ReactNode;
  experience: ReactNode;
  reviews: ReactNode;
  courses: ReactNode;
}

/**
 * Sticky tab navigation for `/tutor/[slug]`. Kept in a small client component
 * so the rest of the page can stay server-rendered. The tab content itself is
 * passed in via props — each tab is composed on the server by the page.
 *
 * The list is wrapped in a sticky container so it stays visible while the
 * visitor scrolls through long review threads. `top-16` clears the global
 * navbar height (configured in layout.tsx).
 */
export function TutorProfileTabs({
  reviewCount,
  about,
  experience,
  reviews,
  courses,
}: TutorProfileTabsProps) {
  return (
    <Tabs defaultValue="about" className="gap-0">
      <div
        className="sticky top-0 z-30 -mx-4 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:-mx-6 md:px-6"
      >
        <div className="mx-auto w-full max-w-[1240px]">
          <TabsList
            variant="line"
            className="flex h-auto w-full justify-start gap-1 overflow-x-auto border-b border-[color:var(--color-border)] bg-transparent p-0"
          >
            <TabsTrigger
              value="about"
              className="h-12 shrink-0 rounded-none px-4 text-sm data-[state=active]:text-[color:var(--color-primary)] data-[state=active]:after:bg-[color:var(--color-primary)]"
            >
              เกี่ยวกับ
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="h-12 shrink-0 rounded-none px-4 text-sm data-[state=active]:text-[color:var(--color-primary)] data-[state=active]:after:bg-[color:var(--color-primary)]"
            >
              ประสบการณ์
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="h-12 shrink-0 rounded-none px-4 text-sm data-[state=active]:text-[color:var(--color-primary)] data-[state=active]:after:bg-[color:var(--color-primary)]"
            >
              รีวิว ({reviewCount})
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="h-12 shrink-0 rounded-none px-4 text-sm data-[state=active]:text-[color:var(--color-primary)] data-[state=active]:after:bg-[color:var(--color-primary)]"
            >
              คอร์ส
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="pt-6">
        <TabsContent value="about" className="focus-visible:outline-none">
          {about}
        </TabsContent>
        <TabsContent value="experience" className="focus-visible:outline-none">
          {experience}
        </TabsContent>
        <TabsContent value="reviews" className="focus-visible:outline-none">
          {reviews}
        </TabsContent>
        <TabsContent value="courses" className="focus-visible:outline-none">
          {courses}
        </TabsContent>
      </div>
    </Tabs>
  );
}
