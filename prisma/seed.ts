/**
 * Prisma seed — Best Tutor Thailand
 *
 * Seeds subject categories + subjects used by the public site.
 * Slugs follow URL Structure Option B in CLAUDE.md (flat slugs, 301 redirects
 * from the old WordPress category tree are handled in next.config.ts).
 *
 * Usage: `npm run db:seed` (requires DATABASE_URL)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SubjectSeed = {
  name: string;
  slug: string;
  sortOrder: number;
};

type CategorySeed = {
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  subjects: SubjectSeed[];
};

// Ref: CLAUDE.md "หมวดวิชา" table + "Subject URL mapping (Option B)"
const categories: CategorySeed[] = [
  {
    name: "ภาษาต่างประเทศ",
    slug: "foreign-language",
    icon: "languages",
    sortOrder: 1,
    subjects: [
      { name: "ภาษาอังกฤษ", slug: "english", sortOrder: 1 },
      { name: "ภาษาจีน", slug: "chinese", sortOrder: 2 },
      { name: "ภาษาญี่ปุ่น", slug: "japanese", sortOrder: 3 },
      { name: "ภาษาเกาหลี", slug: "korean", sortOrder: 4 },
    ],
  },
  {
    name: "คณิตศาสตร์",
    slug: "math",
    icon: "calculator",
    sortOrder: 2,
    subjects: [
      { name: "คณิตทั่วไป", slug: "math-general", sortOrder: 1 },
      { name: "แคลคูลัส", slug: "calculus", sortOrder: 2 },
      { name: "สถิติ", slug: "statistics", sortOrder: 3 },
      { name: "บัญชี", slug: "accounting", sortOrder: 4 },
    ],
  },
  {
    name: "วิทยาศาสตร์",
    slug: "science",
    icon: "flask-conical",
    sortOrder: 3,
    subjects: [
      { name: "ฟิสิกส์", slug: "physics", sortOrder: 1 },
      { name: "เคมี", slug: "chemistry", sortOrder: 2 },
      { name: "ชีววิทยา", slug: "biology", sortOrder: 3 },
      { name: "วิทย์ทั่วไป", slug: "science-general", sortOrder: 4 },
    ],
  },
  {
    name: "ภาษาไทย",
    slug: "thai",
    icon: "book-open",
    sortOrder: 4,
    subjects: [],
  },
  {
    name: "สังคมศึกษา",
    slug: "social",
    icon: "globe-2",
    sortOrder: 5,
    subjects: [
      { name: "กฎหมาย", slug: "law", sortOrder: 1 },
      { name: "ประวัติศาสตร์", slug: "history", sortOrder: 2 },
      { name: "เศรษฐศาสตร์", slug: "economics", sortOrder: 3 },
    ],
  },
  {
    name: "คอมพิวเตอร์",
    slug: "computer",
    icon: "laptop",
    sortOrder: 6,
    subjects: [
      { name: "คอมพื้นฐาน", slug: "computer-basic", sortOrder: 1 },
      { name: "โปรแกรมมิ่ง", slug: "programming", sortOrder: 2 },
    ],
  },
  {
    name: "ศิลปะ",
    slug: "art",
    icon: "palette",
    sortOrder: 7,
    subjects: [
      { name: "วาดรูป", slug: "drawing", sortOrder: 1 },
      { name: "กราฟิกดีไซน์", slug: "graphic-design", sortOrder: 2 },
    ],
  },
  {
    name: "ดนตรี",
    slug: "music",
    icon: "music",
    sortOrder: 8,
    subjects: [
      { name: "กีตาร์", slug: "guitar", sortOrder: 1 },
      { name: "กลอง", slug: "drum", sortOrder: 2 },
      { name: "เต้น", slug: "dance", sortOrder: 3 },
      { name: "เปียโน", slug: "piano", sortOrder: 4 },
    ],
  },
  {
    name: "กีฬา",
    slug: "sport",
    icon: "dumbbell",
    sortOrder: 9,
    subjects: [
      { name: "ว่ายน้ำ", slug: "swim", sortOrder: 1 },
      { name: "เทควันโด", slug: "taekwondo", sortOrder: 2 },
      { name: "แบดมินตัน", slug: "badminton", sortOrder: 3 },
      { name: "โยคะ", slug: "yoga", sortOrder: 4 },
    ],
  },
];

async function seedSubjectTaxonomy() {
  let categoryCount = 0;
  let subjectCount = 0;

  for (const cat of categories) {
    const category = await prisma.subjectCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
    categoryCount += 1;

    for (const sub of cat.subjects) {
      await prisma.subject.upsert({
        where: { slug: sub.slug },
        update: {
          name: sub.name,
          sortOrder: sub.sortOrder,
          categoryId: category.id,
        },
        create: {
          name: sub.name,
          slug: sub.slug,
          sortOrder: sub.sortOrder,
          categoryId: category.id,
        },
      });
      subjectCount += 1;
    }
  }

  return { categoryCount, subjectCount };
}

async function main() {
  console.log("[seed] start");
  const { categoryCount, subjectCount } = await seedSubjectTaxonomy();
  console.log(
    `[seed] done — ${categoryCount} categories, ${subjectCount} subjects`,
  );
}

main()
  .catch((error) => {
    console.error("[seed] failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
