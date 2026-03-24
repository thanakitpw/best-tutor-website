# Project Checklist — Best Tutor Thailand Redesign

> อัปเดตล่าสุด: 2026-03-24
> เป้าหมายหลัก: **Lead Generation** + **SEO**

---

## Phase 1: วางแผนและออกแบบ

### 1.1 วิเคราะห์และเก็บข้อมูล
- [x] สร้าง CLAUDE.md (tech stack, DB schema, โครงสร้าง, กฎ)
- [x] สำรวจเว็บเดิม besttutorthailand.com อย่างละเอียด
- [x] เก็บรายการรูปภาพทั้งหมดจากเว็บเดิม (165+ รูป)
- [x] วิเคราะห์คู่แข่ง bestkru.com
- [x] เขียน UX/UI Analysis (`docs/ux-ui-analysis.md`)
- [x] ติดตั้ง Antigravity Skills (82 skills)
- [x] Git init + Push to GitHub

### 1.2 Design ใน Paper
- [x] Design System (สี, ฟอนต์, ปุ่ม, badges)
- [x] Homepage — Desktop (1440px) — 10 sections ครบ
- [ ] Homepage — Mobile (390px)
- [x] หน้ารายวิชาที่เปิดสอน (`/tutors/`) — 8 หมวดวิชา image cards
- [x] หน้าวิชาย่อย — ภาษาอังกฤษ (`/subject/english/`) — Hero + Tutors + Benefits
- [x] หน้าโปรไฟล์ติวเตอร์ (`/tutor/[slug]/`) — รูปซ้าย + ข้อมูลขวา + Shopee reviews
- [ ] หน้าโปรไฟล์ติวเตอร์ — Mobile
- [x] หน้าหาครูสอนพิเศษ (`/find-tutor/`) — Illustration + Form + Progress bar
- [x] หน้าบทความ (`/blog/`) — Sidebar + Grid 3 คอลัมน์ + Pagination
- [x] หน้าบทความเดี่ยว (`/blog/[slug]/`) — Featured image + Content + Sidebar CTA
- [x] หน้าสมัครเป็นติวเตอร์ (`/join-with-us/`) — Hero + 4 Benefits + Stats + CTA
- [x] หน้าฟอร์มสมัครติวเตอร์ (`/tutor-register/`) — 3-step form
- [x] หน้ารีวิว (`/review/`) — Star rating + Text + Image upload
- [ ] Admin Dashboard
- [ ] Admin จัดการติวเตอร์
- [ ] Admin จัดการบทความ (CMS)
- [ ] Admin จัดการ Lead
- [ ] Admin จัดการรีวิว

---

## Phase 2: Setup โปรเจกต์

### 2.1 Init Next.js
- [ ] `npx create-next-app@latest` (App Router, TypeScript, Tailwind CSS v4, ESLint)
- [ ] ตั้งค่า `tsconfig.json` (path aliases `@/`)
- [ ] ตั้งค่า `.env.local` (Supabase, Cloudinary, Line, Resend)
- [ ] สร้าง `.gitignore` (ไม่ commit .env, node_modules)
- [ ] สร้างโครงสร้างโฟลเดอร์ตาม CLAUDE.md

### 2.2 ติดตั้ง Dependencies
- [ ] shadcn/ui (`npx shadcn@latest init` + components ที่ต้องใช้)
- [ ] Prisma (`npx prisma init`)
- [ ] Supabase client (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Zod (form validation)
- [ ] React Hook Form
- [ ] TanStack Query (data fetching)
- [ ] Tiptap (WYSIWYG editor สำหรับ CMS)
- [ ] Cloudinary SDK (`next-cloudinary`)
- [ ] Resend (email)
- [ ] Lucide React (icons)

### 2.3 ตั้งค่า Database (Supabase + Prisma)
- [ ] สร้าง Supabase project
- [ ] เชื่อม Prisma กับ Supabase PostgreSQL
- [ ] สร้าง Prisma Schema:
  - [ ] ตาราง `users` (admin, editor)
  - [ ] ตาราง `tutors`
  - [ ] ตาราง `subject_categories`
  - [ ] ตาราง `subjects`
  - [ ] ตาราง `tutor_subjects` (many-to-many)
  - [ ] ตาราง `articles`
  - [ ] ตาราง `leads`
  - [ ] ตาราง `reviews`
  - [ ] ตาราง `courses`
- [ ] `npx prisma db push` (push schema ไป Supabase)
- [ ] สร้าง Prisma client singleton (`lib/prisma.ts`)
- [ ] Seed data หมวดวิชา 9 หมวด + 26 วิชาย่อย

### 2.4 ตั้งค่า Auth
- [ ] ตั้งค่า Supabase Auth (Email + Password)
- [ ] สร้าง Auth middleware (`middleware.ts`)
- [ ] สร้าง Auth helpers (server/client)
- [ ] ตั้งค่า Role-based access (super_admin, admin, editor)
- [ ] สร้างหน้า Login สำหรับ Admin

### 2.5 ตั้งค่า File Upload
- [ ] สร้าง Cloudinary account + ตั้งค่า
- [ ] สร้าง upload API route (`/api/upload`)
- [ ] ตั้งค่า image optimization (auto format, resize)
- [ ] ตั้งค่า Supabase Storage (สำหรับเอกสาร)

### 2.6 ตั้งค่า Line Messaging API
- [ ] สร้าง Line OA channel
- [ ] ตั้งค่า Channel Access Token
- [ ] สร้าง Line notify helper (`lib/line.ts`)
- [ ] ทดสอบส่ง push message

---

## Phase 3: พัฒนาหน้าเว็บสาธารณะ (Frontend)

### 3.1 Layout & Components พื้นฐาน
- [ ] Root Layout (`app/layout.tsx`) — fonts, metadata, providers
- [ ] Navbar component (Logo, เมนู, Search, CTA)
- [ ] Footer component (4 คอลัมน์, Social links, Copyright)
- [ ] Mobile navigation (hamburger menu)
- [ ] Breadcrumb component

### 3.2 หน้าแรก (Homepage) — สำคัญที่สุดสำหรับ Lead
- [ ] Hero Section (รูปพื้นหลัง + overlay + Search Card + Stats)
- [ ] Partners/University logos bar
- [ ] หมวดวิชายอดนิยม (8 การ์ด + icon จากเว็บเดิม)
- [ ] ติวเตอร์แนะนำ (4 การ์ด + รูปจริง + รีวิว + ราคา)
- [ ] คอร์สเรียนแนะนำ (4 การ์ด + รูปจากเว็บเดิม)
- [ ] "ทำงานอย่างไร" 3 ขั้นตอน
- [ ] Testimonials (3 รีวิว + ดาวทอง)
- [ ] CTA Banner "เป็นติวเตอร์กับเรา"
- [ ] FAQ Section (JSON-LD สำหรับ SEO)

### 3.3 หน้ารายการติวเตอร์ (`/tutors`)
- [ ] Subject category grid (9 หมวด + icon)
- [ ] Link ไปแต่ละหมวดวิชา
- [ ] SEO metadata + JSON-LD (ItemList)

### 3.4 หน้าหมวดวิชา (`/subject/[category]` + `/subject/[category]/[sub]`)
- [ ] Banner หมวดวิชา
- [ ] Filter sidebar (ราคา, คะแนนรีวิว, ประสบการณ์, พื้นที่)
- [ ] Tutor cards grid (พร้อมข้อมูลครบ)
- [ ] Pagination
- [ ] SEO metadata + JSON-LD
- [ ] Breadcrumb

### 3.5 หน้าโปรไฟล์ติวเตอร์ (`/tutor/[slug]`)
- [ ] Hero (รูปใหญ่ + ข้อมูลหลัก + คะแนนรีวิว + Badge)
- [ ] Tab navigation (เกี่ยวกับ / ประสบการณ์ / รีวิว / คอร์ส)
- [ ] ข้อมูลการสอน (วิชา, แนวการสอน, ตารางเวลา)
- [ ] ระบบรีวิวแบบ Shopee:
  - [ ] คะแนนเฉลี่ย + กราฟแจกแจง
  - [ ] รายการรีวิว (ดาว + ข้อความ + รูป)
  - [ ] Admin ตอบกลับรีวิว
- [ ] Sticky CTA Bar (mobile)
- [ ] ฟอร์มติดต่อ / นัดเรียนทดลอง
- [ ] ติวเตอร์คนอื่นในวิชาเดียวกัน (Related)
- [ ] SEO metadata + JSON-LD (Person + AggregateRating + Review)
- [ ] Breadcrumb

### 3.6 หน้าหาครูสอนพิเศษ (`/find-tutor`) — Lead Capture
- [ ] ฟอร์ม 2 ขั้นตอน:
  - [ ] Step 1: วิชา + ระดับชั้น + พื้นที่
  - [ ] Step 2: ชื่อ + เบอร์โทร (Email/Line optional)
- [ ] แสดงผลติวเตอร์ที่เหมาะ (หลัง Step 1)
- [ ] Loading state + Success page
- [ ] ส่งแจ้งเตือน Line OA อัตโนมัติ
- [ ] ส่ง email ยืนยัน (Resend)
- [ ] บันทึก lead ลง database

### 3.7 หน้าบทความ (`/blog`)
- [ ] Blog listing page (grid + pagination + category filter)
- [ ] Blog category page (`/blog/[category]`)
- [ ] Blog detail page (`/blog/[slug]`)
  - [ ] เนื้อหาบทความ (render จาก Tiptap JSON)
  - [ ] Table of Contents (auto-generate จาก headings)
  - [ ] Author info
  - [ ] Related articles
  - [ ] CTA "หาครูสอนพิเศษ" ในบทความ
- [ ] SEO metadata + JSON-LD (Article)
- [ ] Breadcrumb

### 3.8 หน้าสมัครเป็นติวเตอร์
- [ ] หน้าข้อมูล (`/join-with-us`) — สิทธิประโยชน์, ขั้นตอน, FAQ
- [ ] ฟอร์มสมัคร (`/tutor-register`) — 3 ขั้นตอน:
  - [ ] Step 1: ข้อมูลพื้นฐาน (ชื่อ, เบอร์, email, อาชีพ)
  - [ ] Step 2: ข้อมูลการสอน (วุฒิ, ประสบการณ์, วิชา, ราคา, พื้นที่)
  - [ ] Step 3: เอกสาร (รูปโปรไฟล์, บัตรประชาชน, วุฒิการศึกษา)
- [ ] Progress bar (Step 1/3, 2/3, 3/3)
- [ ] Auto-save draft
- [ ] Success page + email ยืนยัน
- [ ] แจ้ง Line OA เมื่อมีติวเตอร์สมัครใหม่

### 3.9 หน้ารีวิว (`/review`)
- [ ] ฟอร์มเขียนรีวิว (ชื่อ, ดาว 1-5, ข้อความ, อัปโหลดรูป 1-5 รูป)
- [ ] เลือกติวเตอร์ที่จะรีวิว
- [ ] Success page

---

## Phase 4: พัฒนาระบบหลังบ้าน (Admin)

### 4.1 Admin Layout
- [ ] Sidebar navigation (Dashboard, ติวเตอร์, บทความ, Lead, รีวิว, ตั้งค่า)
- [ ] Header (ชื่อ admin, logout)
- [ ] Auth guard (redirect ถ้าไม่ login)
- [ ] Role-based menu (ซ่อนเมนูตาม role)

### 4.2 Dashboard (`/admin/dashboard`)
- [ ] Stats cards (ติวเตอร์, lead, บทความ, รีวิว)
- [ ] กราฟ lead ย้อนหลัง 30 วัน
- [ ] รายการ lead ล่าสุด 5 รายการ
- [ ] รีวิวใหม่ที่รอตรวจสอบ

### 4.3 จัดการติวเตอร์ (`/admin/tutors`)
- [ ] รายการติวเตอร์ (ตาราง + search + filter สถานะ)
- [ ] เพิ่มติวเตอร์ใหม่ (`/admin/tutors/new`)
- [ ] แก้ไขติวเตอร์ (`/admin/tutors/[id]/edit`)
- [ ] อัปโหลดรูปโปรไฟล์ + เอกสาร (Cloudinary)
- [ ] กำหนดวิชาที่สอน (multi-select)
- [ ] เปลี่ยนสถานะ (pending/approved/rejected/inactive)
- [ ] ทำเครื่องหมาย "ยอดนิยม"
- [ ] ลบ/ซ่อนติวเตอร์

### 4.4 จัดการบทความ CMS (`/admin/articles`)
- [ ] รายการบทความ (ตาราง + filter สถานะ draft/published)
- [ ] เขียนบทความใหม่ (`/admin/articles/new`)
  - [ ] Tiptap WYSIWYG editor
  - [ ] อัปโหลดรูปในบทความ
  - [ ] Featured image
  - [ ] หมวดหมู่ + tags
  - [ ] SEO fields (title, description, keywords)
  - [ ] สถานะ draft/published
  - [ ] กำหนดวันเผยแพร่
- [ ] แก้ไขบทความ (`/admin/articles/[id]/edit`)
- [ ] Preview บทความก่อนเผยแพร่
- [ ] ลบบทความ

### 4.5 จัดการ Lead (`/admin/leads`)
- [ ] รายการ lead ทั้งหมด (ตาราง + search + filter)
- [ ] Filter ตามสถานะ (new/contacted/matched/closed)
- [ ] Filter ตามวิชา, วันที่
- [ ] ดูรายละเอียด lead
- [ ] เปลี่ยนสถานะ lead
- [ ] บันทึกโน้ตต่อ lead
- [ ] Export lead เป็น CSV

### 4.6 จัดการรีวิว (`/admin/reviews`)
- [ ] รายการรีวิวทั้งหมด (ตาราง + filter)
- [ ] Filter ตามสถานะ (รอตรวจสอบ/อนุมัติ/ซ่อน)
- [ ] อนุมัติ/ซ่อนรีวิว
- [ ] ตอบกลับรีวิว (admin reply)

### 4.7 ตั้งค่าระบบ (`/admin/settings`)
- [ ] จัดการผู้ใช้ (เพิ่ม/ลบ admin, editor)
- [ ] กำหนด role (super_admin เท่านั้น)
- [ ] ตั้งค่าทั่วไป (ชื่อเว็บ, เบอร์โทร, Line ID)

---

## Phase 5: SEO & Performance

### 5.1 SEO Technical
- [ ] Dynamic metadata ทุกหน้า (`generateMetadata`)
- [ ] Open Graph + Twitter Cards ทุกหน้า
- [ ] Canonical URLs
- [ ] XML Sitemap (`/sitemap.xml`) — auto-generate
- [ ] Robots.txt
- [ ] 301 Redirects จาก URL เดิม (ถ้า URL เปลี่ยน)

### 5.2 Schema Markup (JSON-LD)
- [ ] Organization (หน้าแรก)
- [ ] WebSite + SearchAction (หน้าแรก)
- [ ] BreadcrumbList (ทุกหน้า)
- [ ] Person + AggregateRating + Review (หน้าโปรไฟล์ติวเตอร์)
- [ ] Article (หน้าบทความ)
- [ ] FAQPage (หน้าที่มี FAQ)
- [ ] Course (หน้าคอร์ส)
- [ ] LocalBusiness (หน้าแรก)

### 5.3 Programmatic SEO
- [ ] สร้างหน้า วิชา x จังหวัด อัตโนมัติ (`/subject/english/bangkok`)
- [ ] สร้างหน้า วิชา x รูปแบบ (`/subject/english/online`)
- [ ] Dynamic meta title/description ตาม pattern
- [ ] Internal linking อัตโนมัติ (วิชา ↔ ติวเตอร์ ↔ บทความ)

### 5.4 Performance
- [ ] Next.js Image optimization ทุกรูป
- [ ] Lazy loading สำหรับรูปที่อยู่ below-the-fold
- [ ] Skeleton loading screens
- [ ] ISR (Incremental Static Regeneration) สำหรับหน้าติวเตอร์/บทความ
- [ ] ตรวจสอบ Core Web Vitals (LCP, FID, CLS)
- [ ] Bundle size optimization

---

## Phase 6: Integration & Notification

### 6.1 Line OA Integration
- [ ] แจ้งเตือนเมื่อมี lead ใหม่ (Push Message)
- [ ] แจ้งเตือนเมื่อมีติวเตอร์สมัครใหม่
- [ ] แจ้งเตือนเมื่อมีรีวิวใหม่
- [ ] Rich Message format (ชื่อ, วิชา, เบอร์โทร, จังหวัด)

### 6.2 Email (Resend)
- [ ] Email ยืนยัน lead submission
- [ ] Email ยืนยันสมัครติวเตอร์
- [ ] Email template สวยงาม (HTML)

### 6.3 Analytics
- [ ] ติดตั้ง Google Analytics (GA4)
- [ ] ตั้งค่า Conversion tracking (form submit = conversion)
- [ ] Event tracking (คลิกปุ่ม CTA, ดูโปรไฟล์ติวเตอร์)

---

## Phase 7: Testing & Security

### 7.1 Testing
- [ ] Unit tests สำหรับ utility functions
- [ ] Integration tests สำหรับ API routes
- [ ] E2E tests สำหรับ critical flows:
  - [ ] หาครูสอนพิเศษ (กรอกฟอร์ม → ส่ง lead)
  - [ ] สมัครเป็นติวเตอร์ (กรอกฟอร์ม → ส่งข้อมูล)
  - [ ] Admin login → จัดการติวเตอร์
  - [ ] Admin เขียนบทความ → publish

### 7.2 Security
- [ ] ทุก API route ตรวจสอบ Auth + Role
- [ ] Input validation ด้วย Zod ทุกฟอร์ม
- [ ] Rate limiting สำหรับ form submission
- [ ] CSRF protection
- [ ] XSS prevention (sanitize HTML content)
- [ ] SQL injection protection (Prisma parameterized queries)
- [ ] File upload validation (ขนาด, ประเภทไฟล์)
- [ ] Environment variables ไม่ expose ใน client

---

## Phase 8: Data Migration

### 8.1 ดึงข้อมูลจากเว็บเดิม
- [ ] ดาวน์โหลดรูปติวเตอร์ 65 คน
- [ ] ดาวน์โหลด Logo + icons + banners
- [ ] ดาวน์โหลดรูป partner logos 29 รูป
- [ ] ดาวน์โหลดรูปคอร์ส 4 รูป
- [ ] ดาวน์โหลดรูปบทความ

### 8.2 นำเข้าข้อมูล
- [ ] Import ข้อมูลติวเตอร์ ~103 คน
- [ ] Import หมวดวิชา 9 หมวด + 26 วิชาย่อย
- [ ] Import บทความ (ถ้ามี)
- [ ] อัปโหลดรูปทั้งหมดขึ้น Cloudinary
- [ ] ตรวจสอบข้อมูลหลัง import

---

## Phase 9: Deploy & Launch

### 9.1 Pre-launch Checklist
- [ ] ทดสอบทุกหน้าบน mobile + desktop
- [ ] ตรวจสอบ SEO metadata ทุกหน้า
- [ ] ตรวจสอบ Schema markup (Google Rich Results Test)
- [ ] ตรวจสอบ performance (Lighthouse score > 90)
- [ ] ตรวจสอบ accessibility (WCAG AA)
- [ ] ทดสอบ form submission + Line OA notification
- [ ] ทดสอบ Admin ทุก feature
- [ ] สำรองข้อมูล WordPress เดิม

### 9.2 Deploy to Vercel
- [ ] เชื่อม GitHub repo กับ Vercel
- [ ] ตั้งค่า Environment Variables บน Vercel
- [ ] ตั้งค่า Custom Domain (besttutorthailand.com)
- [ ] ตั้งค่า SSL certificate
- [ ] ทดสอบ production build

### 9.3 Post-launch
- [ ] ตรวจสอบ Google Search Console (indexing)
- [ ] Submit sitemap ไป Google
- [ ] ตรวจสอบ 301 redirects ทำงานถูกต้อง
- [ ] Monitor error logs (Vercel)
- [ ] Monitor Core Web Vitals
- [ ] เริ่มเขียนบทความ SEO (เป้าหมาย 50+ บทความ)

---

## สรุปความคืบหน้า

| Phase | สถานะ | ความคืบหน้า |
|---|---|---|
| Phase 1: วางแผน | กำลังทำ | 95% (เหลือ Mobile + Admin design) |
| Phase 2: Setup | ยังไม่เริ่ม | 0% |
| Phase 3: Frontend | ยังไม่เริ่ม | 0% |
| Phase 4: Admin | ยังไม่เริ่ม | 0% |
| Phase 5: SEO | ยังไม่เริ่ม | 0% |
| Phase 6: Integration | ยังไม่เริ่ม | 0% |
| Phase 7: Testing | ยังไม่เริ่ม | 0% |
| Phase 8: Migration | ยังไม่เริ่ม | 0% |
| Phase 9: Deploy | ยังไม่เริ่ม | 0% |
