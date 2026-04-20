# Project Checklist — Best Tutor Thailand Redesign

> อัปเดตล่าสุด: 2026-04-20
> เป้าหมายหลัก: **Lead Generation** + **SEO**
> การทำงาน: **Agent Team** ตาม `CLAUDE.md` → ทุก task มี owner (teammate) + skills ที่ใช้

---

## Legend

| Emoji | Teammate | ย่อ |
|---|---|---|
| 🎨 | Frontend Dev | FE |
| ⚙️ | Backend Dev | BE |
| 🛠️ | Admin Dev | AD |
| 📈 | SEO & Content | SEO |
| 🔍 | QA Reviewer | QA |
| 👑 | Lead (session นี้) | Lead |

Status: `[ ]` = todo · `[x]` = done · `[~]` = in progress · `[!]` = blocked

---

## Phase 0: Pre-dev Prep (ใหม่ — ต้องเสร็จก่อน Phase 2)

### 0.1 ขอข้อมูลจากลูกค้า (blocking)
- [ ] 👑 ขอ Google Search Console access (ดู keyword ที่ติดอันดับ)
- [ ] 👑 ขอ Google Analytics access (12 เดือนย้อนหลัง)
- [ ] 👑 ขอ WordPress admin access (export content)
- [ ] 👑 ขอรายชื่อติวเตอร์ 103 คน + slug ที่ใช้อยู่
- [ ] 👑 ขอ keyword เป้าหมาย (ถ้ามี)
- [ ] 👑 ขอ logo ต้นฉบับ + brand assets

### 0.2 ตัดสินใจ URL strategy
- [ ] 👑 ตัดสินใจ Option A (URL ตรงเว็บเดิม) หรือ Option B (URL ย่อ + 301) — อ้าง `docs/seo-migration-audit.md`
- [ ] 👑 อัปเดต `CLAUDE.md` URL Structure section ตามที่ตัดสินใจ
- [ ] 👑 อัปเดต `docs/seo-migration-audit.md` confirm 301 redirect map

### 0.3 Backup เว็บเดิม
- [ ] 👑 Export WordPress database (`.sql`)
- [ ] 👑 Export WordPress media library (`wp-content/uploads/`)
- [ ] 👑 บันทึก `wp-sitemap.xml`
- [ ] 👑 Screenshot หน้าหลัก 15 หน้า
- [ ] 👑 Download รูปติวเตอร์ (65 คนที่มีรูป)
- [ ] 👑 Download รูปบทความ 12 ตัว (OG images)
- [ ] 👑 Download logo + partner logos 29 รูป

---

## Phase 1: วางแผนและออกแบบ (95% done)

### 1.1 วิเคราะห์และเก็บข้อมูล ✅
- [x] 👑 สร้าง `CLAUDE.md`
- [x] 👑 สำรวจเว็บเดิม
- [x] 👑 วิเคราะห์คู่แข่ง bestkru.com
- [x] 👑 เขียน `docs/ux-ui-analysis.md`
- [x] 👑 ติดตั้ง Antigravity Skills (82 skills)
- [x] 👑 Git init + Push to GitHub
- [x] 👑 สร้าง `docs/seo-migration-audit.md` ← **ใหม่ 2026-04-20**
- [x] 👑 อัปเดต CLAUDE.md เพิ่ม Agent Team Workflow + SEO-First Rules ← **ใหม่ 2026-04-20**

### 1.2 Design ใน Paper
- [x] 🎨 Design System (สี, ฟอนต์, ปุ่ม, badges)
- [x] 🎨 Homepage Desktop (1440px)
- [ ] 🎨 Homepage Mobile (390px) — `/mobile-design`
- [x] 🎨 `/tutors/` — 8 หมวดวิชา
- [x] 🎨 `/subject/english/` — Hero + Tutors + Benefits
- [x] 🎨 `/tutor/[slug]/` — รูปซ้าย + ข้อมูลขวา + Shopee reviews
- [ ] 🎨 `/tutor/[slug]/` Mobile — `/mobile-design`
- [x] 🎨 `/find-tutor/`
- [x] 🎨 `/blog/`
- [x] 🎨 `/blog/[slug]/`
- [x] 🎨 `/join-with-us/`
- [x] 🎨 `/tutor-register/`
- [x] 🎨 `/review/`
- [x] 🛠️ Admin Dashboard
- [ ] 🛠️ Admin จัดการติวเตอร์ (pattern เดียวกับ Lead table)
- [ ] 🛠️ Admin จัดการบทความ CMS (+ Tiptap editor)
- [x] 🛠️ Admin จัดการ Lead
- [ ] 🛠️ Admin จัดการรีวิว
- [ ] 🎨 Sticky LINE/Call floating button ทุกหน้า (ขาดใน design) — `/form-cro`
- [ ] 🎨 Tutor card พัฒนาเพิ่ม: ราคา + รีวิว + พื้นที่ (ขาดใน subject page)
- [ ] 🎨 Subject page เพิ่ม Filter sidebar (ราคา/ประสบการณ์/พื้นที่/rating)

---

## Phase 2: Setup โปรเจกต์

### 2.1 Init Next.js (👑 Lead)
- [ ] 👑 `npx create-next-app@latest` (App Router, TypeScript, Tailwind CSS v4, ESLint)
- [ ] 👑 ตั้งค่า `tsconfig.json` (path aliases `@/`)
- [ ] 👑 สร้าง `.env.local.example` + `.env.local` (Supabase, Cloudinary, Line, Resend)
- [ ] 👑 สร้าง `.gitignore`
- [ ] 👑 สร้างโครงสร้างโฟลเดอร์ตาม `CLAUDE.md`
- [ ] 👑 ตั้งค่า `next.config.ts` — image domains (Cloudinary), 301 redirects จาก audit
- [ ] 👑 commit + push — `chore: init Next.js 15 + Tailwind v4 + TypeScript`

### 2.2 ติดตั้ง Dependencies (👑 Lead)
- [ ] 👑 shadcn/ui init + components พื้นฐาน (Button, Input, Card, Dialog, Form, Table, Toast)
- [ ] 👑 Prisma + `@prisma/client`
- [ ] 👑 `@supabase/supabase-js` + `@supabase/ssr`
- [ ] 👑 `zod` + `react-hook-form` + `@hookform/resolvers`
- [ ] 👑 `@tanstack/react-query`
- [ ] 👑 Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, extensions)
- [ ] 👑 `next-cloudinary` + `cloudinary`
- [ ] 👑 `resend`
- [ ] 👑 `lucide-react`
- [ ] 👑 Fonts: Plus Jakarta Sans + Noto Sans Thai (via `next/font`)
- [ ] 👑 commit + push — `chore: install core dependencies`

### 2.3 Database Setup (⚙️ Backend Dev)
**skills:** `/prisma-expert` `/supabase` `/supabase-postgres-best-practices` `/database-design`

- [ ] ⚙️ สร้าง Supabase project
- [ ] ⚙️ เชื่อม Prisma กับ Supabase PostgreSQL
- [ ] ⚙️ เขียน `prisma/schema.prisma`:
  - [ ] ⚙️ `User` (Supabase Auth UID, role, name, email)
  - [ ] ⚙️ `Tutor` (+ SEO fields: seo_title, seo_description, seo_keywords, og_image_url, canonical_url)
  - [ ] ⚙️ `SubjectCategory` (+ SEO fields)
  - [ ] ⚙️ `Subject` (+ SEO fields)
  - [ ] ⚙️ `TutorSubject` (many-to-many)
  - [ ] ⚙️ `Article` (+ SEO fields, Tiptap JSON content)
  - [ ] ⚙️ `Lead`
  - [ ] ⚙️ `Review` (+ `images` URL array)
  - [ ] ⚙️ `Course`
- [ ] ⚙️ `npx prisma db push`
- [ ] ⚙️ Prisma client singleton (`src/lib/prisma.ts`)
- [ ] ⚙️ Seed data: 9 หมวด + 26 วิชาย่อย (`prisma/seed.ts`)
- [ ] 🔍 QA review schema — `/code-reviewer`
- [ ] 👑 commit + push — `feat(db): Prisma schema with SEO fields + seed categories`

### 2.4 Auth Setup (⚙️ Backend Dev)
**skills:** `/nextjs-supabase-auth` `/auth-implementation-patterns`

- [ ] ⚙️ Supabase Auth (Email + Password)
- [ ] ⚙️ `middleware.ts` — protect `/admin/*`
- [ ] ⚙️ Auth helpers `src/lib/supabase/server.ts`, `client.ts`
- [ ] ⚙️ Role-based access (super_admin, admin, editor) — row-level security ใน Supabase
- [ ] ⚙️ Login page `/admin/login`
- [ ] 🔍 QA security review — `/cc-skill-security-review`
- [ ] 👑 commit + push — `feat(auth): Supabase auth + RBAC middleware`

### 2.5 File Upload Setup (⚙️ Backend Dev)
**skills:** `/file-uploads`

- [ ] ⚙️ Cloudinary account + configure
- [ ] ⚙️ API route `POST /api/upload` (Cloudinary signed upload)
- [ ] ⚙️ Image transform presets (thumbnail, card, hero)
- [ ] ⚙️ Supabase Storage bucket สำหรับเอกสาร (resume, id-card)
- [ ] ⚙️ File validation (size, MIME type) ใน Zod
- [ ] 👑 commit + push — `feat(upload): Cloudinary + Supabase storage endpoints`

### 2.6 Line Messaging API Setup (⚙️ Backend Dev)
- [ ] ⚙️ สร้าง Line OA channel + token
- [ ] ⚙️ Helper `src/lib/line/notify.ts`
- [ ] ⚙️ ทดสอบ push message
- [ ] 👑 commit + push — `feat(line): Line OA push message helper`

### 2.7 SEO Foundation (📈 SEO & Content)
**skills:** `/seo-fundamentals` `/schema-markup` `/fixing-metadata`

- [ ] 📈 `src/app/robots.ts` — dynamic robots
- [ ] 📈 `src/app/sitemap.ts` — dynamic sitemap (อ่าน Prisma)
- [ ] 📈 `src/lib/seo/` — helpers (generateMetadata defaults, JSON-LD builders)
  - [ ] 📈 `site-metadata.ts` (site-wide defaults)
  - [ ] 📈 `json-ld/organization.ts`
  - [ ] 📈 `json-ld/website.ts` (+ SearchAction)
  - [ ] 📈 `json-ld/local-business.ts`
  - [ ] 📈 `json-ld/person.ts` (tutor)
  - [ ] 📈 `json-ld/article.ts` (blog)
  - [ ] 📈 `json-ld/breadcrumb.ts`
  - [ ] 📈 `json-ld/faq.ts`
  - [ ] 📈 `json-ld/item-list.ts`
  - [ ] 📈 `json-ld/review.ts` (+ AggregateRating)
- [ ] 📈 OG image generator (`src/app/opengraph-image.tsx` + per-route)
- [ ] 🔍 QA review — `/code-reviewer` `/fixing-metadata`
- [ ] 👑 commit + push — `feat(seo): foundation (sitemap, robots, JSON-LD builders)`

### 2.8 Testing Setup (🔍 QA)
**skills:** `/testing-patterns` `/test-driven-development`

- [ ] 🔍 Vitest + `@testing-library/react`
- [ ] 🔍 Playwright สำหรับ E2E
- [ ] 🔍 GitHub Actions workflow (lint + test + type-check)
- [ ] 👑 commit + push — `chore(test): Vitest + Playwright + CI`

---

## Phase 3: พัฒนาหน้าเว็บสาธารณะ (Frontend)

**กฎ SEO-First:** ทุกหน้าต้องมี `generateMetadata` + JSON-LD ตามประเภท (อ้าง `CLAUDE.md` SEO-First Rules)

### 3.1 Layout + Shared Components (🎨 Frontend Dev + 👑 Lead)
**skills:** `/nextjs-app-router-patterns` `/shadcn` `/tailwind-patterns`

- [ ] 👑 Root `app/layout.tsx` — fonts, providers (TanStack Query, Toast), site metadata
- [ ] 🎨 `components/public/navbar.tsx` (Logo, menu, CTA)
- [ ] 🎨 `components/public/mobile-nav.tsx` (hamburger)
- [ ] 🎨 `components/public/footer.tsx` (4 คอลัมน์ + social)
- [ ] 🎨 `components/public/breadcrumb.tsx`
- [ ] 🎨 `components/public/sticky-cta.tsx` (LINE/Call floating)
- [ ] 🎨 `components/public/tutor-card.tsx` (reusable — รูป + รีวิว + ราคา + วิชา)
- [ ] 🎨 `components/public/subject-card.tsx`
- [ ] 🎨 `components/public/article-card.tsx`
- [ ] 🔍 QA accessibility — `/fixing-accessibility`
- [ ] 👑 commit + push — `feat(ui): root layout + shared public components`

### 3.2 หน้าแรก `/` (🎨 Frontend Dev + 📈 SEO)
**skills:** `/nextjs-best-practices` `/frontend-design` `/form-cro`

- [ ] 🎨 Hero Section (bg image + overlay + Search Card + Stats bar)
- [ ] 🎨 Partner/University logos bar (29 logos)
- [ ] 🎨 หมวดวิชายอดนิยม (8 cards + icon)
- [ ] 🎨 ติวเตอร์แนะนำ (4 cards + รีวิว + ราคา)
- [ ] 🎨 คอร์สเรียนแนะนำ (4 cards)
- [ ] 🎨 "ทำงานอย่างไร" 3 ขั้นตอน
- [ ] 🎨 Testimonials (3 รีวิว + ดาวทอง)
- [ ] 🎨 CTA Banner "เป็นติวเตอร์กับเรา"
- [ ] 🎨 FAQ Section
- [ ] 📈 `generateMetadata` (title: "หาครูสอนพิเศษ ติวเตอร์ตัวต่อตัว..." + keyword)
- [ ] 📈 JSON-LD: `Organization` + `WebSite` + `SearchAction` + `LocalBusiness` + `FAQPage`
- [ ] 🎨 Mobile version (≥ 390px)
- [ ] 🔍 QA perf — `/web-performance-optimization` (LCP < 2.5s)
- [ ] 👑 commit + push — `feat(home): homepage with hero search + stats + FAQ`

### 3.3 `/tutors/` (🎨 Frontend + ⚙️ Backend + 📈 SEO)
- [ ] ⚙️ API `GET /api/subjects` — list categories
- [ ] 🎨 Subject category grid (9 หมวด + icon)
- [ ] 🎨 Link ไปแต่ละหมวดวิชา
- [ ] 🎨 Breadcrumb
- [ ] 📈 `generateMetadata` ("รายวิชาที่เปิดสอน...")
- [ ] 📈 JSON-LD: `ItemList` (subjects) + `BreadcrumbList`
- [ ] 👑 commit + push — `feat(tutors): subjects listing page`

### 3.4 Subject category + sub `/subject/[category]/[sub]` (🎨 FE + ⚙️ BE + 📈 SEO)
**skills:** `/nextjs-app-router-patterns` `/tanstack-query-expert`

- [ ] ⚙️ API `GET /api/tutors?category=X&sub=Y&filters=...`
- [ ] 🎨 Banner หมวดวิชา
- [ ] 🎨 **Filter sidebar** (ราคา, ประสบการณ์, พื้นที่, rating) — แก้ปัญหา UX เดิม
- [ ] 🎨 Tutor cards grid (รูป + ดาว + ราคา + วิชา + ปุ่ม LINE/โทร)
- [ ] 🎨 Pagination (URL-based `?page=2`)
- [ ] 🎨 Sort: relevance / rating / price / newest
- [ ] 🎨 Breadcrumb
- [ ] 📈 `generateMetadata` (ตาม category/sub + location keyword)
- [ ] 📈 JSON-LD: `ItemList` + `BreadcrumbList`
- [ ] 🔍 QA — `/code-reviewer` `/web-performance-optimization`
- [ ] 👑 commit + push — `feat(subject): category pages with filter + pagination`

### 3.5 Tutor Profile `/tutor/[slug]` (🎨 FE + ⚙️ BE + 📈 SEO)
**skills:** `/frontend-design` (หน้าสำคัญสุดสำหรับ lead conversion)

- [ ] ⚙️ API `GET /api/tutors/[slug]` (+ reviews aggregate)
- [ ] 🎨 Hero (รูปใหญ่ + ข้อมูลหลัก + คะแนนรีวิว + verified badge)
- [ ] 🎨 Tab navigation (เกี่ยวกับ / ประสบการณ์ / รีวิว / คอร์ส)
- [ ] 🎨 ข้อมูลการสอน (วิชา, แนวการสอน, ตารางเวลา)
- [ ] 🎨 ระบบรีวิวแบบ Shopee:
  - [ ] 🎨 คะแนนเฉลี่ย + bar chart แจกแจง
  - [ ] 🎨 รายการรีวิว (ดาว + ข้อความ + รูป)
  - [ ] 🎨 Admin reply แสดง
- [ ] 🎨 Sticky CTA Bar (mobile) — LINE + โทร
- [ ] 🎨 ฟอร์มนัดเรียนทดลอง
- [ ] 🎨 Related tutors (วิชาเดียวกัน)
- [ ] 🎨 Mobile version
- [ ] 📈 `generateMetadata` (title: "ติวเตอร์ [ชื่อ] สอน [วิชา] ในพื้นที่ [จังหวัด]")
- [ ] 📈 JSON-LD: `Person` + `AggregateRating` + `Review` (เยอะหลาย reviews) + `BreadcrumbList`
- [ ] 🔍 QA — full review
- [ ] 👑 commit + push — `feat(tutor): tutor profile with Shopee-style reviews`

### 3.6 `/find-tutor/` — **Lead Capture สำคัญสุด** (🎨 FE + ⚙️ BE + 📈 SEO)
**skills:** `/form-cro` `/zod-validation-expert`

- [ ] ⚙️ API `POST /api/leads` (+ Zod validation + rate limit)
- [ ] ⚙️ Line OA notify hook (fire on new lead)
- [ ] ⚙️ Email confirm via Resend
- [ ] 🎨 Step 1: วิชา + ระดับชั้น + พื้นที่
- [ ] 🎨 Step 2: ชื่อ + เบอร์โทร (Email/Line optional)
- [ ] 🎨 แสดงผลติวเตอร์ที่เหมาะหลัง Step 1 (Value Before Ask)
- [ ] 🎨 Progress bar
- [ ] 🎨 Loading state + Success page
- [ ] 🎨 Analytics events (step complete, submit)
- [ ] 📈 `generateMetadata`
- [ ] 📈 JSON-LD: `BreadcrumbList`
- [ ] 🔍 QA — `/form-cro` audit + security `/api-security-best-practices`
- [ ] 👑 commit + push — `feat(find-tutor): 2-step lead form + LINE notify`

### 3.7 Blog (🎨 FE + ⚙️ BE + 📈 SEO)
**skills:** `/seo-structure-architect` `/blog-writing-guide`

- [ ] ⚙️ API `GET /api/articles?category=&page=`
- [ ] ⚙️ API `GET /api/articles/[slug]`
- [ ] 🎨 `/blog/` listing (grid 3 cols + sidebar + pagination)
- [ ] 🎨 `/blog/[category]/`
- [ ] 🎨 `/blog/[slug]/`:
  - [ ] 🎨 Render Tiptap JSON → HTML
  - [ ] 🎨 Auto Table of Contents (จาก H2/H3)
  - [ ] 🎨 Author info
  - [ ] 🎨 Related articles
  - [ ] 🎨 In-content CTA + sidebar CTA "หาครูสอนพิเศษ"
- [ ] 📈 `generateMetadata` (จาก article SEO fields)
- [ ] 📈 JSON-LD: `Article` + `BreadcrumbList`
- [ ] 📈 Handle 301 redirects สำหรับ blog URLs เก่า (จาก audit) — เพิ่มใน `next.config.ts`
- [ ] 🔍 QA — Article schema validation
- [ ] 👑 commit + push — `feat(blog): listing + category + detail pages`

### 3.8 `/join-with-us/` + `/tutor-register/` (🎨 FE + ⚙️ BE + 📈 SEO)
**skills:** `/signup-flow-cro`

- [ ] 🎨 `/join-with-us/` — Hero + 4 Benefits + Stats + CTA + FAQ
- [ ] ⚙️ API `POST /api/tutors/register` (pending status)
- [ ] 🎨 `/tutor-register/` 3-step:
  - [ ] 🎨 Step 1: ข้อมูลพื้นฐาน
  - [ ] 🎨 Step 2: ข้อมูลการสอน
  - [ ] 🎨 Step 3: เอกสาร (upload to Cloudinary + Supabase Storage)
- [ ] 🎨 Auto-save draft (localStorage)
- [ ] ⚙️ Email confirm + Line OA notify admin
- [ ] 📈 `generateMetadata` + `BreadcrumbList`
- [ ] 🔍 QA — `/signup-flow-cro`
- [ ] 👑 commit + push — `feat(tutor-register): 3-step registration with docs upload`

### 3.9 `/review/` (🎨 FE + ⚙️ BE + 📈 SEO)
- [ ] ⚙️ API `POST /api/reviews` (pending status)
- [ ] 🎨 ฟอร์มเขียนรีวิว (ชื่อ + ดาว + ข้อความ + upload รูป 1-5)
- [ ] 🎨 เลือกติวเตอร์ (combobox with search)
- [ ] 🎨 Success page
- [ ] 📈 `generateMetadata`
- [ ] 👑 commit + push — `feat(review): submit review form`

---

## Phase 4: พัฒนาระบบหลังบ้าน (Admin)

### 4.1 Admin Layout (🛠️ Admin Dev)
**skills:** `/auth-implementation-patterns`

- [ ] 🛠️ `/admin/layout.tsx` — sidebar + header
- [ ] 🛠️ `components/admin/sidebar.tsx` (Dashboard/ติวเตอร์/บทความ/Lead/รีวิว/ตั้งค่า)
- [ ] 🛠️ `components/admin/header.tsx` (ชื่อ admin + logout)
- [ ] 🛠️ Auth guard (redirect if not logged in)
- [ ] 🛠️ Role-based menu
- [ ] 👑 commit + push — `feat(admin): layout + sidebar + auth guard`

### 4.2 Admin Dashboard (🛠️ Admin Dev)
**skills:** `/tanstack-query-expert`

- [ ] ⚙️ API `GET /api/admin/stats`
- [ ] 🛠️ Stats cards (ติวเตอร์/lead/บทความ/รีวิว)
- [ ] 🛠️ กราฟ lead ย้อนหลัง 30 วัน (recharts)
- [ ] 🛠️ รายการ lead ล่าสุด 5 รายการ
- [ ] 🛠️ รีวิวใหม่ที่รอตรวจสอบ
- [ ] 👑 commit + push — `feat(admin): dashboard with stats + charts`

### 4.3 จัดการติวเตอร์ `/admin/tutors` (🛠️ Admin Dev + ⚙️ BE)
- [ ] ⚙️ API `GET/POST/PATCH/DELETE /api/admin/tutors`
- [ ] 🛠️ รายการติวเตอร์ (table + search + filter สถานะ + pagination)
- [ ] 🛠️ `/admin/tutors/new` — form สร้าง
- [ ] 🛠️ `/admin/tutors/[id]/edit` — form แก้ไข
- [ ] 🛠️ อัปโหลดรูปโปรไฟล์ + เอกสาร
- [ ] 🛠️ Multi-select วิชา
- [ ] 🛠️ เปลี่ยนสถานะ (pending/approved/rejected/inactive)
- [ ] 🛠️ Toggle "ยอดนิยม"
- [ ] 🛠️ SEO fields (seo_title, seo_description, og_image)
- [ ] 🔍 QA
- [ ] 👑 commit + push — `feat(admin): tutor CRUD management`

### 4.4 จัดการบทความ CMS `/admin/articles` (🛠️ Admin Dev + ⚙️ BE)
**skills:** `/file-uploads`

- [ ] ⚙️ API CRUD articles
- [ ] 🛠️ รายการบทความ (table + filter status)
- [ ] 🛠️ `/admin/articles/new`:
  - [ ] 🛠️ Tiptap editor (headings, bold, lists, image, link, embed)
  - [ ] 🛠️ Upload รูปในบทความ (Cloudinary)
  - [ ] 🛠️ Featured image
  - [ ] 🛠️ หมวดหมู่ + tags
  - [ ] 🛠️ SEO fields (title, description, keywords, og_image)
  - [ ] 🛠️ Status draft/published + scheduled publish date
- [ ] 🛠️ Preview บทความก่อนเผยแพร่
- [ ] 🛠️ Duplicate article
- [ ] 🛠️ ลบบทความ (soft delete)
- [ ] 👑 commit + push — `feat(admin): article CMS with Tiptap + SEO`

### 4.5 จัดการ Lead `/admin/leads` (🛠️ Admin Dev + ⚙️ BE)
- [ ] ⚙️ API `GET /api/admin/leads` + `PATCH /api/admin/leads/[id]`
- [ ] 🛠️ Table + tabs (ทั้งหมด/ใหม่/ติดต่อ/จับคู่/ปิด)
- [ ] 🛠️ Search + filter (วิชา, วันที่)
- [ ] 🛠️ ดูรายละเอียด lead (drawer)
- [ ] 🛠️ เปลี่ยนสถานะ + บันทึกโน้ต
- [ ] 🛠️ Export CSV
- [ ] 👑 commit + push — `feat(admin): lead management + CSV export`

### 4.6 จัดการรีวิว `/admin/reviews` (🛠️ Admin Dev + ⚙️ BE)
- [ ] ⚙️ API CRUD reviews
- [ ] 🛠️ Table + filter (รอตรวจ/อนุมัติ/ซ่อน)
- [ ] 🛠️ อนุมัติ/ซ่อนรีวิว
- [ ] 🛠️ Admin reply
- [ ] 👑 commit + push — `feat(admin): review moderation`

### 4.7 ตั้งค่าระบบ `/admin/settings` (🛠️ Admin Dev + ⚙️ BE)
- [ ] ⚙️ API admin users
- [ ] 🛠️ จัดการ users (super_admin เท่านั้น)
- [ ] 🛠️ ตั้งค่าทั่วไป (ชื่อเว็บ, เบอร์, Line ID, social)
- [ ] 👑 commit + push — `feat(admin): settings + user management`

---

## Phase 5: SEO Content + Programmatic

**หมายเหตุ:** Technical SEO (metadata, JSON-LD, sitemap, schema) ทำใน Phase 2-3 แล้ว — Phase นี้เน้น **content** + **programmatic expansion**

### 5.1 Content Audit (📈 SEO)
**skills:** `/seo-content-auditor` `/seo-keyword-strategist`

- [ ] 📈 ตรวจสอบ title + description ทุกหน้าเทียบ keyword target
- [ ] 📈 ตรวจ internal linking (crawl ด้วย script)
- [ ] 📈 ตรวจ image alt text ครบ
- [ ] 📈 ตรวจ Core Web Vitals (Lighthouse score > 90)
- [ ] 📈 Rich Results Test ทุกประเภทหน้า

### 5.2 Programmatic SEO (📈 SEO + 🎨 FE)
**skills:** `/programmatic-seo`

- [ ] 📈 วิชา × จังหวัด — `/subject/english/bangkok/` (77 จังหวัด × 26 วิชา = ~2,000 หน้า)
- [ ] 📈 วิชา × รูปแบบ — `/subject/english/online/`, `/subject/english/at-home/`
- [ ] 📈 Dynamic title/description pattern
- [ ] 📈 Internal linking อัตโนมัติ
- [ ] 📈 Canonical ป้องกัน duplicate
- [ ] 📈 Add ใน sitemap
- [ ] 🔍 QA — spot check 20 หน้า
- [ ] 👑 commit + push — `feat(seo): programmatic pages (subject × province/format)`

### 5.3 Content Writing (📈 SEO)
**skills:** `/seo-content-writer` `/seo-content-planner` `/blog-writing-guide`

- [ ] 📈 Keyword research (เชื่อม Google Search Console + Ahrefs ถ้ามี)
- [ ] 📈 Content calendar 3 เดือน (40+ บทความ เพิ่มจาก 12 ที่มี)
- [ ] 📈 Migrate บทความเดิม 12 ตัว + rewrite SEO fields ให้ดี
- [ ] 📈 เขียนบทความใหม่ 10 บทความแรก:
  - [ ] 📈 "ติวเตอร์ภาษาอังกฤษ [จังหวัดใหญ่]"
  - [ ] 📈 "วิธีเลือกครูสอนพิเศษสำหรับ [ช่วงวัย]"
  - [ ] 📈 "เตรียมสอบ [TGAT/TPAT/A-Level/O-NET]"
  - [ ] 📈 "เรียนออนไลน์ vs เรียนที่บ้าน"
  - [ ] 📈 "ติว GED / IELTS / TOEIC"
  - [ ] 📈 "ติวเตอร์ [วิชา] สำหรับ [ระดับชั้น]"

---

## Phase 6: Integration & Notification

### 6.1 Line OA Integration (⚙️ Backend Dev)
- [ ] ⚙️ แจ้งเตือน lead ใหม่ (Push Message)
- [ ] ⚙️ แจ้งเตือนติวเตอร์สมัครใหม่
- [ ] ⚙️ แจ้งเตือนรีวิวใหม่
- [ ] ⚙️ Flex Message format (name, subject, phone, province)
- [ ] 🔍 QA test messages

### 6.2 Email (Resend) (⚙️ Backend Dev)
- [ ] ⚙️ Email ยืนยัน lead
- [ ] ⚙️ Email ยืนยันสมัครติวเตอร์
- [ ] ⚙️ React Email templates (สวย + responsive)

### 6.3 Analytics (🎨 Frontend Dev)
- [ ] 🎨 Google Analytics 4
- [ ] 🎨 Conversion tracking (form submit = conversion)
- [ ] 🎨 Event tracking (CTA click, tutor profile view, form step complete)
- [ ] 🎨 Migrate GA4 account จากลูกค้า

---

## Phase 7: Testing & Security

### 7.1 Testing (🔍 QA Reviewer)
**skills:** `/testing-patterns` `/test-driven-development`

- [ ] 🔍 Unit tests (utils, Zod schemas, SEO helpers)
- [ ] 🔍 Integration tests (API routes + Prisma)
- [ ] 🔍 E2E critical flows:
  - [ ] 🔍 หาครูสอนพิเศษ (ฟอร์ม → lead)
  - [ ] 🔍 สมัครติวเตอร์ (3 steps → pending)
  - [ ] 🔍 Admin login → จัดการติวเตอร์
  - [ ] 🔍 Admin เขียนบทความ → publish → หน้า /blog/[slug] แสดง
  - [ ] 🔍 Submit review → approve → แสดงใน tutor profile

### 7.2 Security Audit (🔍 QA)
**skills:** `/cc-skill-security-review` `/api-security-best-practices` `/find-bugs`

- [ ] 🔍 ทุก API route auth + role check
- [ ] 🔍 Zod validation ทุกฟอร์ม
- [ ] 🔍 Rate limiting (Upstash Redis หรือ in-memory)
- [ ] 🔍 CSRF protection
- [ ] 🔍 XSS prevention (DOMPurify ใน Tiptap output)
- [ ] 🔍 SQL injection (Prisma safe by default)
- [ ] 🔍 File upload validation
- [ ] 🔍 Env vars ไม่ leak to client

---

## Phase 8: Data Migration

### 8.1 ดึงข้อมูลจากเว็บเดิม (👑 Lead + ⚙️ BE)
- [ ] 👑 Export WordPress DB (done ใน Phase 0)
- [ ] ⚙️ เขียน migration script `prisma/migrations/from-wp.ts`
- [ ] ⚙️ Parse WP data → Prisma models:
  - [ ] ⚙️ Tutors (103 คน + SEO fields)
  - [ ] ⚙️ Articles (12 ตัว + content + featured images)
  - [ ] ⚙️ Categories (ตามที่เว็บเดิมใช้)
- [ ] ⚙️ Upload images → Cloudinary (แปลง path)
- [ ] ⚙️ Verify count + sample data
- [ ] 🔍 QA spot-check 20 records

### 8.2 URL redirect verify (📈 SEO)
- [ ] 📈 ตรวจ 301 redirects ครบตาม `seo-migration-audit.md`
- [ ] 📈 Test ด้วย curl + Lighthouse

---

## Phase 9: Deploy & Launch

### 9.1 Pre-launch Checklist
- [ ] 🔍 ทดสอบทุกหน้า mobile + desktop
- [ ] 📈 SEO metadata ครบทุกหน้า
- [ ] 📈 Schema markup ผ่าน Google Rich Results Test ทุกประเภท
- [ ] 🔍 Lighthouse > 90 (perf/a11y/SEO/best-practices)
- [ ] 🔍 Accessibility WCAG AA
- [ ] 🔍 Form submission + Line OA notification
- [ ] 🔍 Admin CRUD ทุก feature
- [ ] 👑 Backup WordPress เดิม (final snapshot)

### 9.2 Deploy to Vercel (👑 Lead)
- [ ] 👑 Vercel project + GitHub integration
- [ ] 👑 Environment variables
- [ ] 👑 Custom domain `besttutorthailand.com`
- [ ] 👑 SSL + DNS records
- [ ] 👑 Production build test

### 9.3 Post-launch (👑 Lead + 📈 SEO)
- [ ] 📈 Submit sitemap ไป Google Search Console
- [ ] 📈 ขอ re-index หน้าหลัก
- [ ] 📈 ตรวจ 301 redirects ผ่านจริง
- [ ] 👑 Monitor Vercel logs (24-48 ชม.)
- [ ] 👑 Monitor Core Web Vitals
- [ ] 📈 เริ่มเขียนบทความ SEO (target 50+ ใน 3 เดือน)
- [ ] 📈 Monitor keyword ranking ย้อนหลัง (Search Console ทุกสัปดาห์)

---

## สรุปความคืบหน้า

| Phase | Owner หลัก | สถานะ | ความคืบหน้า |
|---|---|---|---|
| Phase 0: Pre-dev Prep | 👑 Lead | skip (ลูกค้าเก็บ data ครบ) | — |
| Phase 1: Design | 🎨 FE + 🛠️ AD | กำลังทำ | 95% (เหลือ Mobile + Admin designs + sticky CTA) |
| Phase 2: Setup | 👑 Lead + ⚙️ BE + 📈 SEO | **เสร็จ 2026-04-20** ✅ | 100% (ยังไม่ได้ `prisma db push` — รอ Supabase creds) |
| Phase 3: Frontend | 🎨 FE + ⚙️ BE + 📈 SEO | ยังไม่เริ่ม | 0% |
| Phase 4: Admin | 🛠️ AD + ⚙️ BE | ยังไม่เริ่ม | 0% |
| Phase 5: SEO Content | 📈 SEO | ยังไม่เริ่ม | 0% |
| Phase 6: Integration | ⚙️ BE + 🎨 FE | ยังไม่เริ่ม | 0% |
| Phase 7: Testing | 🔍 QA | foundation พร้อม (Vitest/Playwright/CI) | infra 100% · feature tests 0% |
| Phase 8: Migration | 👑 Lead + ⚙️ BE | ยังไม่เริ่ม | 0% |
| Phase 9: Deploy | 👑 Lead + 📈 SEO | ยังไม่เริ่ม | 0% |

---

## Dependencies & Parallel Plan

```
Phase 0 (blocking) → ต้องเสร็จก่อนทุกอย่าง (ขอข้อมูลลูกค้า)
       ↓
Phase 1 (Design) ─────┐
       ↓              │ (Phase 1 Mobile + Admin designs รันขนานกับ Phase 2)
Phase 2 (Setup) ──────┤
 ├─ 2.1-2.2 Lead      │
 ├─ 2.3-2.6 Backend   │
 ├─ 2.7 SEO foundation│
 └─ 2.8 QA testing setup
       ↓
Phase 3 (Frontend) + Phase 4 (Admin) — รันขนานได้ เมื่อ Backend ทำ schema + auth เสร็จ
  ├─ Frontend (FE + BE API) — หน้า public
  ├─ Admin (AD + BE API) — admin panel
  └─ SEO ช่วย generateMetadata + JSON-LD ทุกหน้า
       ↓
Phase 5 (SEO Content) — หลัง Phase 3 เสร็จ (ต้องมี public pages ก่อน programmatic)
Phase 6 (Integration) — หลัง Phase 3-4 (ต่อ Line + Email เข้า form submissions)
Phase 7 (Testing) — เริ่มได้ตั้งแต่ Phase 2, เข้มข้นใน Phase 8
Phase 8 (Migration) — หลัง Phase 4 (ต้อง Admin CRUD พร้อม)
Phase 9 (Deploy) — เมื่อ Phase 7 pass
```

---

## คำสั่งที่ Lead ใช้บ่อย

```bash
npm install
npm run dev
npx prisma generate
npx prisma db push
npx prisma studio
npm run build
npm run lint
npm run test
npm run test:e2e
```

---

## Reference Documents

- [`CLAUDE.md`](../CLAUDE.md) — โปรเจกต์ rules + Agent Team Workflow + SEO-First Rules
- [`docs/ux-ui-analysis.md`](ux-ui-analysis.md) — UX/UI analysis
- [`docs/site-structure-crawl.md`](site-structure-crawl.md) — โครงสร้างเว็บเดิม
- [`docs/seo-migration-audit.md`](seo-migration-audit.md) — SEO audit + URL strategy + keywords
