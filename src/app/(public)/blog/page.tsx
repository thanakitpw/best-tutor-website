import type { Metadata } from "next";

import { Breadcrumb } from "@/components/public/breadcrumb";
import { BlogCategoryChips } from "@/components/public/blog-category-chips";
import { BlogCategorySidebar } from "@/components/public/blog-category-sidebar";
import { BlogSearch } from "@/components/public/blog-search";
import {
  countArticlesByCategory,
  getAllArticles,
} from "@/components/public/mock-articles";
import { JsonLd } from "@/lib/seo/json-ld-script";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site-metadata";

import { BlogHero } from "./_blog-hero";

export const metadata: Metadata = buildMetadata({
  title:
    "บทความและข่าวสารการศึกษา แนะแนวติวเตอร์ | Best Tutor Thailand",
  description:
    "อัปเดตบทความด้านการศึกษา แนวข้อสอบ วิธีเลือกติวเตอร์ และคู่มือเตรียมสอบจากทีมงาน Best Tutor Thailand ครบทุกระดับชั้น",
  path: "/blog",
  keywords: [
    "บทความการศึกษา",
    "เลือกติวเตอร์",
    "เตรียมสอบเข้ามหาวิทยาลัย",
    "ติวเตอร์ภาษาอังกฤษ",
    "TGAT TPAT",
    "Best Tutor Thailand",
  ],
});

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const counts = countArticlesByCategory();
  const total = articles.length;

  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: "บทความ", url: "/blog" },
  ] as const;

  const schemas = [
    buildBreadcrumbSchema([...breadcrumbItems]),
    {
      "@context": "https://schema.org" as const,
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blog#collection`,
      name: "บทความและข่าวสารการศึกษา",
      url: `${SITE_URL}/blog`,
      description:
        "อัปเดตบทความด้านการศึกษา แนวข้อสอบ และวิธีเลือกติวเตอร์จาก Best Tutor Thailand",
      inLanguage: "th-TH",
    },
  ];

  return (
    <>
      <JsonLd schema={schemas} />

      <BlogHero
        eyebrow="บทความและข่าวสาร"
        title="อัปเดตแนวทางการเรียน และ การเลือกติวเตอร์"
        description="คัดสรรบทความคุณภาพจากทีมงาน Best Tutor Thailand และติวเตอร์มืออาชีพ ครอบคลุมตั้งแต่การเลือกครู ราคาเรียน ไปจนถึงเทคนิคเตรียมสอบเข้ามหาวิทยาลัย"
        breadcrumb={<Breadcrumb items={[...breadcrumbItems]} variant="light" />}
        stat={`รวม ${total.toLocaleString("th-TH")} บทความพร้อมอัปเดตประจำ`}
      />

      <section className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
        <BlogCategoryChips activeSlug={null} counts={counts} total={total} />
        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-8">
          <BlogCategorySidebar
            activeSlug={null}
            counts={counts}
            total={total}
            className="hidden lg:flex"
          />
          <div>
            <BlogSearch articles={articles} />
          </div>
        </div>
      </section>
    </>
  );
}

