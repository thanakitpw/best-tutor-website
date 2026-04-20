# CLAUDE.md — Best Tutor Thailand Redesign

## ภาพรวมโปรเจกต์

โปรเจกต์นี้คือการย้ายเว็บไซต์ https://besttutorthailand.com/ จาก WordPress มาเป็นเว็บแอปพลิเคชันแบบ custom code พร้อมระบบหลังบ้าน (Admin CMS) เต็มรูปแบบ

**ประเภทเว็บ:** แพลตฟอร์มจับคู่นักเรียนกับติวเตอร์ส่วนตัวในประเทศไทย
**Tagline:** "เป้าหมายของคุณ ความสำเร็จของเรา"

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth |
| File Storage | Cloudinary (รูปภาพ) + Supabase Storage (เอกสาร) |
| Hosting | Vercel |
| Email | Resend |
| Notification | Line Messaging API (Line OA) |
| Text Editor | Tiptap (WYSIWYG สำหรับบทความ) |
| Analytics | Google Analytics |

---

## โครงสร้างโปรเจกต์ (ที่วางแผนไว้)

```
best-tutor-redesign/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # หน้าเว็บสาธารณะ
│   │   │   ├── page.tsx                    # หน้าแรก
│   │   │   ├── tutors/page.tsx             # รายวิชาทั้งหมด
│   │   │   ├── subject/[category]/         # หน้าหมวดวิชา
│   │   │   │   └── [sub]/page.tsx          # หน้าหมวดวิชาย่อย
│   │   │   ├── tutor/[slug]/page.tsx       # โปรไฟล์ติวเตอร์
│   │   │   ├── find-tutor/page.tsx         # ฟอร์มหาครูสอนพิเศษ
│   │   │   ├── blog/                       # บทความ
│   │   │   │   ├── page.tsx                # รายการบทความ
│   │   │   │   ├── [category]/page.tsx     # บทความตามหมวด
│   │   │   │   └── [slug]/page.tsx         # บทความเดี่ยว
│   │   │   ├── join-with-us/page.tsx       # ข้อมูลสมัครเป็นติวเตอร์
│   │   │   ├── tutor-register/page.tsx     # ฟอร์มสมัครติวเตอร์
│   │   │   └── review/page.tsx             # หน้ารีวิว
│   │   ├── admin/              # ระบบหลังบ้าน (ต้อง login)
│   │   │   ├── dashboard/page.tsx          # Dashboard รวมข้อมูล
│   │   │   ├── tutors/                     # จัดการติวเตอร์
│   │   │   │   ├── page.tsx                # รายการติวเตอร์
│   │   │   │   ├── new/page.tsx            # เพิ่มติวเตอร์
│   │   │   │   └── [id]/edit/page.tsx      # แก้ไขติวเตอร์
│   │   │   ├── articles/                   # จัดการบทความ
│   │   │   │   ├── page.tsx                # รายการบทความ
│   │   │   │   ├── new/page.tsx            # เขียนบทความ
│   │   │   │   └── [id]/edit/page.tsx      # แก้ไขบทความ
│   │   │   ├── leads/page.tsx              # ข้อมูลจากฟอร์ม
│   │   │   ├── reviews/page.tsx            # จัดการรีวิว
│   │   │   └── settings/page.tsx           # ตั้งค่าระบบ + จัดการสิทธิ์
│   │   ├── api/                # API Routes
│   │   │   ├── tutors/
│   │   │   ├── articles/
│   │   │   ├── leads/
│   │   │   ├── reviews/
│   │   │   ├── upload/
│   │   │   └── line-notify/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── public/             # Components สำหรับหน้าสาธารณะ
│   │   └── admin/              # Components สำหรับหลังบ้าน
│   ├── lib/
│   │   ├── supabase/           # Supabase client + helpers
│   │   ├── prisma/             # Prisma client + schema
│   │   ├── cloudinary/         # Upload + optimize รูป
│   │   ├── line/               # Line Messaging API
│   │   └── utils/              # Utility functions
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── .env.local                  # Environment variables (ไม่ commit)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

---

## Database Schema (หลัก)

### ตาราง tutors — ข้อมูลติวเตอร์
- id, slug, nickname, first_name, last_name, gender
- email, phone, line_id
- profile_image_url, education, occupation
- teaching_experience (ปี), teaching_style, subjects_taught
- rate_pricing, address, vehicle_type
- documents (resume, id_card, credentials — URLs)
- status (pending/approved/rejected/inactive)
- is_popular (boolean)
- created_at, updated_at

### ตาราง subject_categories — หมวดวิชาหลัก
- id, name, slug, icon, sort_order

### ตาราง subjects — วิชาย่อย
- id, category_id (FK), name, slug, sort_order

### ตาราง tutor_subjects — ความสัมพันธ์ติวเตอร์-วิชา (Many-to-Many)
- tutor_id (FK), subject_id (FK)

### ตาราง articles — บทความ SEO
- id, title, slug, content (rich text), excerpt
- featured_image_url, category, tags
- seo_title, seo_description, seo_keywords
- author_id (FK), status (draft/published)
- published_at, created_at, updated_at

### ตาราง leads — ข้อมูลจากฟอร์มหาครู
- id, subject_category, subject, learning_goal
- student_age_group, province, district
- full_name, email, phone, line_id
- status (new/contacted/matched/closed)
- notes, created_at

### ตาราง reviews — รีวิวติวเตอร์
- id, tutor_id (FK), reviewer_name
- rating (1-5), comment, images (URLs array)
- is_verified (boolean), is_visible (boolean)
- admin_reply, created_at

### ตาราง courses — คอร์สแนะนำ
- id, title, description, subject_id (FK)
- duration_hours, featured_image_url
- is_featured (boolean), sort_order

### ตาราง users — ผู้ใช้ระบบหลังบ้าน
- id (Supabase Auth UID), email, name
- role (super_admin/admin/editor)
- created_at

---

## หมวดวิชา (จากเว็บเดิม)

| หมวดหลัก | วิชาย่อย |
|---|---|
| ภาษาต่างประเทศ | อังกฤษ, จีน, ญี่ปุ่น, เกาหลี |
| คณิตศาสตร์ | คณิตทั่วไป, แคลคูลัส, สถิติ, บัญชี |
| วิทยาศาสตร์ | ฟิสิกส์, เคมี, ชีววิทยา, วิทย์ทั่วไป |
| ภาษาไทย | — |
| สังคมศึกษา | กฎหมาย, ประวัติศาสตร์, เศรษฐศาสตร์ |
| คอมพิวเตอร์ | คอมพื้นฐาน, โปรแกรมมิ่ง |
| ศิลปะ | วาดรูป, กราฟิกดีไซน์ |
| ดนตรี | กีตาร์, กลอง, เต้น, เปียโน |
| กีฬา | ว่ายน้ำ, เทควันโด, แบดมินตัน, โยคะ |

---

## ฟีเจอร์ระบบหลังบ้าน (Admin)

### 1. Dashboard
- สรุปจำนวนติวเตอร์ทั้งหมด (active/pending)
- จำนวน lead ใหม่วันนี้/สัปดาห์นี้/เดือนนี้
- จำนวนบทความที่เผยแพร่/แบบร่าง
- จำนวนรีวิวใหม่ที่รอตรวจสอบ
- กราฟแสดง lead ย้อนหลัง

### 2. จัดการติวเตอร์ (CRUD)
- เพิ่ม/แก้ไข/ลบ/ซ่อนโปรไฟล์ติวเตอร์
- อัปโหลดรูปโปรไฟล์ + เอกสาร
- กำหนดวิชาที่สอน (multi-select)
- ตั้งสถานะ (pending/approved/rejected/inactive)
- ทำเครื่องหมาย "ติวเตอร์ยอดนิยม"

### 3. จัดการบทความ SEO (CMS)
- WYSIWYG editor (Tiptap) สำหรับเขียนบทความ
- ตั้งค่า SEO (title, description, keywords) ต่อบทความ
- รูปภาพประกอบ + featured image
- หมวดหมู่บทความ (ตามวิชา)
- สถานะ draft/published + กำหนดวันเผยแพร่

### 4. จัดการ Lead (ข้อมูลจากฟอร์ม)
- รายการ lead ทั้งหมดพร้อม filter/search
- เปลี่ยนสถานะ lead (new → contacted → matched → closed)
- บันทึกโน้ตต่อ lead
- **แจ้งเตือน Line OA อัตโนมัติ** เมื่อมี lead ใหม่เข้ามา

### 5. จัดการรีวิว
- รีวิวแบบ Shopee style (ดาว + รูป + ข้อความ)
- แอดมินอนุมัติ/ซ่อนรีวิวได้
- แอดมินตอบกลับรีวิวได้
- แสดงสรุปคะแนนเฉลี่ยในโปรไฟล์ติวเตอร์

### 6. จัดการสิทธิ์ผู้ใช้
- super_admin: เข้าถึงทุกอย่าง + จัดการผู้ใช้อื่น
- admin: เข้าถึงทุกอย่างยกเว้นจัดการสิทธิ์
- editor: จัดการบทความ + ดู lead เท่านั้น

---

## ระบบรีวิวแบบ Shopee Style

### ผู้รีวิวกรอก:
- ชื่อผู้รีวิว
- คะแนนดาว (1-5)
- ข้อความรีวิว
- อัปโหลดรูปภาพ (สูงสุด 5 รูป) — เช่น รูปเรียน, ผลสอบ

### แสดงผลในหน้าโปรไฟล์ติวเตอร์:
- คะแนนเฉลี่ย + จำนวนรีวิว (เช่น ⭐ 4.8 (24 รีวิว))
- แถบกราฟแจกแจงคะแนน (5 ดาว: 80%, 4 ดาว: 15%, ...)
- รายการรีวิวเรียงตามล่าสุด
- รูปภาพจากรีวิวแสดงเป็น gallery
- แอดมินตอบกลับได้ (เหมือนร้านค้าตอบใน Shopee)

---

## Line OA Integration

- เมื่อมี lead ใหม่จากฟอร์ม "หาครูสอนพิเศษ" → ส่งข้อความแจ้งเตือนเข้า Line OA อัตโนมัติ
- ข้อความประกอบด้วย: ชื่อ, วิชาที่ต้องการ, เบอร์โทร, จังหวัด
- ใช้ Line Messaging API (Push Message)
- ข้อจำกัด: แพลนฟรี 200 ข้อความ/เดือน, แพลน Light 200 บาท/เดือน = 5,000 ข้อความ

---

## URL Structure (เหมือนเว็บเดิมเพื่อรักษา SEO)

| หน้า | URL |
|---|---|
| หน้าแรก | `/` |
| รายวิชาทั้งหมด | `/tutors` |
| หมวดวิชาหลัก | `/subject/[category]` |
| วิชาย่อย | `/subject/[category]/[sub]` |
| โปรไฟล์ติวเตอร์ | `/tutor/[slug]` |
| หาครูสอนพิเศษ | `/find-tutor` |
| บทความทั้งหมด | `/blog` |
| บทความตามหมวด | `/blog/[category]` |
| อ่านบทความ | `/blog/[slug]` |
| สมัครเป็นติวเตอร์ | `/join-with-us` |
| ฟอร์มสมัครติวเตอร์ | `/tutor-register` |
| หน้ารีวิว | `/review` |
| หลังบ้าน | `/admin/*` |

---

## Design System (อ้างอิงจากเว็บเดิม — อาจปรับ UX/UI ภายหลัง)

### สี
| บทบาท | สี | Hex |
|---|---|---|
| Primary | น้ำเงิน | #046bd2 |
| Primary Hover | น้ำเงินเข้ม | #045cb4 |
| Accent | ฟ้าอ่อน | #0693e3 |
| Heading | เทาเข้ม | #1e293b |
| Body Text | เทา | #334155 |
| Background | ขาว | #FFFFFF |
| Light BG | ขาวอมฟ้า | #F0F5FA |
| Border | เทาอ่อน | #D1D5DB |

### Typography
- ฟอนต์: System fonts (รองรับภาษาไทย)
- Base: 16px, line-height 1.65
- Headings: font-weight 600
- Body: font-weight 400

### Layout
- Max width: 1240px
- Border radius: 6px (cards), 15px (รูปติวเตอร์)
- Responsive breakpoints: 544px (mobile), 921px (tablet)

---

## Environment Variables ที่ต้องตั้งค่า

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Supabase PostgreSQL)
DATABASE_URL=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Line Messaging API
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=

# Resend (Email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_SITE_URL=https://besttutorthailand.com
```

---

## คำสั่งที่ใช้บ่อย

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# สร้าง Prisma client หลังแก้ schema
npx prisma generate

# Push schema ไป database
npx prisma db push

# เปิด Prisma Studio (ดู DB ผ่าน browser)
npx prisma studio

# Build สำหรับ production
npm run build

# รัน linter
npm run lint
```

---

## Antigravity Skills (ต้องใช้ skill ในการทำงานทุกครั้ง)

Skills ถูกติดตั้งไว้ที่ `~/.claude/skills/` จาก [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)

**กฎสำคัญ: ทุกครั้งที่ทำงาน ต้องเรียกใช้ skill ที่เกี่ยวข้องเสมอ**

### วางแผนและออกแบบ
| Skill | ใช้เมื่อ |
|---|---|
| `/brainstorming` | วางแผนฟีเจอร์ใหม่, ระดมไอเดีย |
| `/concise-planning` | วางแผนการ implement งาน |
| `/plan-writing` | เขียนแผนงานแบบมีโครงสร้าง |
| `/ask-questions-if-underspecified` | คำสั่งไม่ชัดเจน ต้องถามก่อนทำ |
| `/architecture` | ตัดสินใจด้าน architecture |

### UX/UI Design
| Skill | ใช้เมื่อ |
|---|---|
| `/ui-ux-pro-max` | วิเคราะห์และออกแบบ UX/UI ระดับสูง (50 styles) |
| `/antigravity-design-expert` | Core UI/UX engineering |
| `/ui-ux-designer` | ออกแบบ wireframe, interface design |
| `/frontend-design` | สร้าง UI ที่สวยงาม production-grade |
| `/product-design` | ออกแบบผลิตภัณฑ์ระดับ Apple |
| `/enhance-prompt` | แปลงไอเดีย UI คร่าว ๆ ให้เป็น spec ชัดเจน |
| `/web-design-guidelines` | ตรวจสอบ UI ตามหลัก Web Design |
| `/scroll-experience` | ออกแบบ scroll experience |
| `/design-spells` | Micro-interactions และ animation |
| `/baseline-ui` | ตรวจสอบ animation performance |

### Frontend Development
| Skill | ใช้เมื่อ |
|---|---|
| `/nextjs-best-practices` | เขียนโค้ด Next.js (ใช้ทุกครั้ง) |
| `/nextjs-app-router-patterns` | App Router, Server Components, ISR |
| `/react-patterns` | React patterns ทั่วไป |
| `/react-best-practices` | Performance optimization |
| `/react-ui-patterns` | Loading states, error boundaries |
| `/react-state-management` | State management |
| `/tailwind-patterns` | เขียน Tailwind CSS v4 |
| `/tailwind-design-system` | สร้าง Design System |
| `/shadcn` | จัดการ shadcn/ui components |
| `/magic-ui-generator` | สร้าง UI component ด้วย Magic UI |
| `/senior-frontend` | Frontend development แบบ senior |
| `/frontend-dev-guidelines` | Frontend standards |
| `/cc-skill-frontend-patterns` | Frontend patterns for React |
| `/tanstack-query-expert` | Data fetching + caching |
| `/zod-validation-expert` | Form validation ด้วย Zod |
| `/fixing-accessibility` | แก้ไข Accessibility |
| `/web-performance-optimization` | เพิ่มความเร็วเว็บ |
| `/i18n-localization` | ระบบหลายภาษา (ถ้าต้องการ) |

### Backend & Database
| Skill | ใช้เมื่อ |
|---|---|
| `/nextjs-supabase-auth` | ระบบ Auth ด้วย Supabase |
| `/prisma-expert` | เขียน Prisma schema + queries |
| `/postgresql` | ออกแบบ PostgreSQL schema |
| `/postgres-best-practices` | Performance optimization |
| `/database-design` | ออกแบบฐานข้อมูล |
| `/database-architect` | สถาปัตยกรรมฐานข้อมูล |
| `/api-design-principles` | ออกแบบ API |
| `/api-endpoint-builder` | สร้าง API endpoint |
| `/auth-implementation-patterns` | ระบบ Auth + Role-based access |
| `/file-uploads` | ระบบอัปโหลดไฟล์ |
| `/cc-skill-backend-patterns` | Backend patterns |
| `/error-handling-patterns` | จัดการ error อย่างเป็นระบบ |

### SEO (สำคัญมากสำหรับโปรเจกต์นี้)
| Skill | ใช้เมื่อ |
|---|---|
| `/seo-fundamentals` | หลักการ SEO พื้นฐาน |
| `/seo-audit` | ตรวจสอบ SEO |
| `/seo-content-writer` | เขียนบทความ SEO |
| `/seo-content-planner` | วางแผนเนื้อหา SEO |
| `/seo-keyword-strategist` | วิเคราะห์ keyword |
| `/seo-meta-optimizer` | เขียน meta title/description |
| `/seo-structure-architect` | โครงสร้างเนื้อหา SEO |
| `/seo-snippet-hunter` | Featured snippets |
| `/seo-content-auditor` | ตรวจสอบคุณภาพเนื้อหา |
| `/schema-markup` | Structured data / JSON-LD |
| `/fixing-metadata` | แก้ไข HTML metadata |
| `/programmatic-seo` | Programmatic SEO สำหรับหน้าวิชา/ติวเตอร์ |
| `/blog-writing-guide` | เขียน/ปรับปรุง blog |
| `/content-creator` | สร้างเนื้อหา marketing |

### CRO (Conversion Rate Optimization)
| Skill | ใช้เมื่อ |
|---|---|
| `/form-cro` | ปรับปรุงฟอร์มหาครูสอนพิเศษ |
| `/page-cro` | ปรับปรุง landing page |
| `/signup-flow-cro` | ปรับปรุงฟอร์มสมัครติวเตอร์ |

### Code Quality & Review
| Skill | ใช้เมื่อ |
|---|---|
| `/cc-skill-coding-standards` | มาตรฐานการเขียนโค้ด |
| `/clean-code` | Clean Code principles |
| `/code-reviewer` | Review โค้ด |
| `/code-simplifier` | ลดความซับซ้อนของโค้ด |
| `/lint-and-validate` | ตรวจสอบคุณภาพโค้ด |
| `/find-bugs` | หา bugs + security issues |
| `/systematic-debugging` | Debug อย่างเป็นระบบ |
| `/typescript-expert` | TypeScript best practices |
| `/cc-skill-security-review` | ตรวจสอบความปลอดภัย |
| `/api-security-best-practices` | API security |

### Testing
| Skill | ใช้เมื่อ |
|---|---|
| `/test-driven-development` | เขียน test ก่อน code |
| `/testing-patterns` | Jest/Vitest patterns |
| `/verification-before-completion` | ตรวจสอบก่อนบอกว่าเสร็จ |

### Git & Deployment
| Skill | ใช้เมื่อ |
|---|---|
| `/commit` | สร้าง commit (ใช้ทุกครั้ง) |
| `/pr-writer` | สร้าง Pull Request |
| `/create-pr` | สร้าง PR (alias) |
| `/vercel-deployment` | Deploy ขึ้น Vercel |

### Full-Stack Orchestration
| Skill | ใช้เมื่อ |
|---|---|
| `/app-builder` | สร้าง application |
| `/full-stack-orchestration-full-stack-feature` | สร้างฟีเจอร์ full-stack |
| `/senior-fullstack` | Fullstack development |
| `/react-nextjs-development` | React + Next.js development |

---

## Agent Team Workflow (สำคัญที่สุด — ต้องทำตามทุกครั้ง)

**กฎเหล็ก:** ทุกงานเขียนโค้ด/ออกแบบ/SEO/Test ต้อง spawn teammate ทำ — Lead (session นี้) ไม่เขียน feature code เอง หน้าที่ Lead คือ orchestration เท่านั้น

### โครงสร้างทีม (5 Teammates + Lead)

**Lead** คือ Claude session หลัก — หน้าที่:
- วางแผน phase + แบ่ง task
- Spawn teammates (ผ่าน `Agent` tool) พร้อม prompt + skills + file boundaries
- Review + merge ผลลัพธ์
- Commit + push + อัปเดต `docs/checklist.md`
- แก้ไฟล์ shared เอง (shadcn primitives, config, docs)

| Teammate | Owns (เขียนได้เท่านั้น) |
|---|---|
| 🎨 **Frontend Dev** | `src/app/(public)/**`, `src/components/public/**`, `src/hooks/**` |
| ⚙️ **Backend Dev** | `src/app/api/**`, `src/lib/**`, `prisma/**`, `middleware.ts` |
| 🛠️ **Admin Dev** | `src/app/admin/**`, `src/components/admin/**` |
| 📈 **SEO & Content** | `src/app/**/metadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo/**`, blog seeds |
| 🔍 **QA Reviewer** | `**/*.test.ts`, `e2e/**`, `.github/workflows/**` (ไม่เขียน feature code) |

**Shared files (Lead เท่านั้น):** `src/components/ui/**` (shadcn primitives), `CLAUDE.md`, `docs/**`, `package.json`, `.env.*`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, theme/font files

### Skills ประจำ teammate

**🎨 Frontend Dev:**
`/nextjs-best-practices` · `/nextjs-app-router-patterns` · `/react-patterns` · `/react-ui-patterns` · `/tailwind-patterns` · `/shadcn` · `/frontend-design` · `/form-cro` · `/fixing-accessibility` · `/mobile-design`

**⚙️ Backend Dev:**
`/nextjs-supabase-auth` · `/prisma-expert` · `/supabase` · `/supabase-postgres-best-practices` · `/postgres-best-practices` · `/api-endpoint-builder` · `/auth-implementation-patterns` · `/file-uploads` · `/zod-validation-expert` · `/error-handling-patterns`

**🛠️ Admin Dev:**
`/nextjs-app-router-patterns` · `/shadcn` · `/tailwind-patterns` · `/react-state-management` · `/tanstack-query-expert` · `/zod-validation-expert` · `/file-uploads` · `/auth-implementation-patterns`

**📈 SEO & Content:**
`/seo-fundamentals` · `/seo-meta-optimizer` · `/schema-markup` · `/fixing-metadata` · `/programmatic-seo` · `/seo-structure-architect` · `/seo-content-writer` · `/seo-keyword-strategist` · `/blog-writing-guide`

**🔍 QA Reviewer:**
`/code-reviewer` · `/find-bugs` · `/cc-skill-security-review` · `/api-security-best-practices` · `/lint-and-validate` · `/test-driven-development` · `/testing-patterns` · `/verification-before-completion` · `/web-performance-optimization`

**Lead (session หลัก):**
`/concise-planning` · `/plan-writing` · `/commit` · `/pr-writer` · `/ui-ux-pro-max` · `/architecture` · `/ask-questions-if-underspecified`

### Workflow ต่อ Phase

```
1. Lead วางแผน phase — break งานเป็น task per teammate
2. ยืนยันกับ user ก่อน spawn (เฉพาะ phase ใหญ่ หรือเรื่องที่ไม่ชัด)
3. Spawn teammates parallel — prompt ต้องมี:
     - Goal + acceptance criteria
     - File boundaries (อ้าง CLAUDE.md)
     - Skills ที่ต้องเรียก
     - Reference docs (site-structure-crawl, ux-ui-analysis, seo-migration-audit)
4. Teammates ทำงาน — ต้องการ API contract → Backend เขียนเสร็จก่อน Frontend consume
5. QA Reviewer ตรวจทุก file (security, test, lint, perf, accessibility)
6. Lead merge + run /lint-and-validate + /verification-before-completion
7. Lead /commit + push + อัปเดต docs/checklist.md
8. รายงาน user ก่อนเริ่ม phase ถัดไป
```

### กฎการสื่อสารระหว่าง teammate

- **ต้อง edit ไฟล์นอก scope?** → ส่งงานให้ owner ผ่าน Lead เท่านั้น ห้ามเขียนเอง
- **ต้องการ API contract?** → Backend เขียน type + route + Zod schema ให้เสร็จก่อน Frontend consume (Frontend import type จาก Backend)
- **Shared primitive (Button, Input, Card, ฯลฯ)?** → แจ้ง Lead เพิ่ม shadcn component ให้ก่อน แล้วทุกคน import
- **เจอ bug ในไฟล์ของ teammate อื่น?** → QA เขียน issue + assign ให้ owner แก้ ไม่แก้เอง
- **SEO ต้องแก้ metadata ในหน้าของ Frontend?** → Frontend เขียน `generateMetadata` เองตาม SEO brief (ใช้ skill `/seo-meta-optimizer` + `/schema-markup`)

### เมื่อไหร่ "ไม่" spawn teammate

- อัปเดต docs (Lead ทำเอง)
- Merge + commit + push (Lead ทำเอง)
- ตัดสินใจ architecture ระดับโปรเจกต์ (Lead ถาม user)
- งานเล็ก < 5 นาที ที่ไม่คุ้ม spawn (เช่น แก้ typo, เพิ่ม 1 บรรทัดใน config)
- สอบถาม/อธิบาย/วิเคราะห์ที่ไม่เขียนโค้ด

---

## กฎการเขียนโค้ด

- ใช้ **TypeScript** เสมอ ห้ามใช้ `any` ถ้าไม่จำเป็น
- ใช้ **App Router** (ไม่ใช้ Pages Router)
- Component ใช้ **Server Components** เป็นหลัก ใช้ `"use client"` เฉพาะที่จำเป็น
- ใช้ **shadcn/ui** สำหรับ UI components ก่อนสร้างเอง
- ตั้งชื่อไฟล์เป็น **kebab-case** (เช่น `tutor-card.tsx`)
- ตั้งชื่อ component เป็น **PascalCase** (เช่น `TutorCard`)
- ใช้ **Prisma** สำหรับทุก database query
- ทุก API route ต้องตรวจสอบ auth + role ก่อนดำเนินการ
- รูปภาพทุกรูปต้องผ่าน **Cloudinary** เพื่อ optimize อัตโนมัติ
- เนื้อหาเว็บสาธารณะเป็น **ภาษาไทย** เป็นหลัก โค้ดเป็น **ภาษาอังกฤษ**
- ตอบคำถาม/สื่อสารกับผู้ใช้เป็น **ภาษาไทยเสมอ**

### SEO-First Rules (บังคับทุก public page)

- ทุก public page ต้อง export `generateMetadata` — ห้ามลืม (QA จะ flag)
- URL structure ต้องตรงกับ `docs/seo-migration-audit.md` 100% (รักษา ranking เดิม)
- Prisma schema ของ entity ที่มีหน้า public (tutor, article, subject, course) ต้องมี fields: `seo_title`, `seo_description`, `seo_keywords`, `og_image_url`, `canonical_url`
- JSON-LD ตามประเภทหน้า (บังคับ):
  - `/` (Homepage): `Organization` + `WebSite` + `SearchAction` + `LocalBusiness`
  - **ทุกหน้า**: `BreadcrumbList`
  - `/tutor/[slug]`: `Person` + `AggregateRating` + `Review`
  - `/blog/[slug]`: `Article` + `BreadcrumbList`
  - หน้า FAQ: `FAQPage`
  - `/subject/[category]` + `/subject/[category]/[sub]`: `ItemList`
  - `/tutors`: `ItemList` (subject categories)
- รูปทุกรูปต้อง alt text (ดึงจาก DB field `alt_text` ไม่ hard-code ภาษาอังกฤษ)
- Internal linking อัตโนมัติ: tutor ↔ subject, blog ↔ related tutors/subjects
- 301 redirect map ใน `next.config.ts` — อ้าง `docs/seo-migration-audit.md`
- Canonical URL บังคับทุกหน้า — ใช้ `NEXT_PUBLIC_SITE_URL` + path
- Sitemap dynamic generate จาก Prisma (`src/app/sitemap.ts`)
- OG image: หน้าที่ไม่มีรูป custom ให้ generate ด้วย `next/og`

---

## เป้าหมายหลักของโปรเจกต์

1. **Lead Generation** — เพิ่มจำนวนคนกรอกฟอร์มหาครูสอนพิเศษให้มากที่สุด
2. **SEO** — ติดอันดับ Google สำหรับ keyword เกี่ยวกับติวเตอร์/สอนพิเศษ

ทุกการตัดสินใจด้าน UX/UI/Feature ต้องวัดจากว่า **ช่วย Lead หรือ SEO** หรือไม่

---

## เอกสารอ้างอิง

| เอกสาร | เนื้อหา |
|---|---|
| [`docs/ux-ui-analysis.md`](docs/ux-ui-analysis.md) | วิเคราะห์ UX/UI เว็บเดิม 12 หัวข้อ + แนวทางปรับปรุง + Design System ใหม่ + Component ที่ต้องสร้าง — **ต้องอ่านก่อนสร้าง UI ทุกครั้ง** |
| [`docs/checklist.md`](docs/checklist.md) | Checklist ทั้งโปรเจกต์ 9 Phases — **ต้องอัปเดตทุกครั้งที่ทำงานเสร็จ** |
| [`docs/site-structure-crawl.md`](docs/site-structure-crawl.md) | โครงสร้างเว็บเดิมแบบละเอียด 15 หน้า ทุก section ทุก field — **อ้างอิงเมื่อสร้างหน้าใหม่** |
| [`docs/seo-migration-audit.md`](docs/seo-migration-audit.md) | SEO audit เว็บเดิม: URL inventory, metadata, 301 redirect map, schema.org — **Backend + SEO teammate ต้องอ่านก่อนสร้าง schema + routes** |

---

## หมายเหตุ

- โปรเจกต์อยู่ในขั้นตอนวางแผน (Phase 1 95%) ยังไม่ได้เริ่มเขียนโค้ด
- ข้อมูลติวเตอร์เดิม ~103 คน (พบรูป 65 คน) จะต้อง migrate จาก WordPress
- รักษา URL structure เดิมให้มากที่สุดเพื่อ SEO
- รูปภาพจากเว็บเดิมสามารถดึงได้ แต่แนะนำขอรูปต้นฉบับจากลูกค้า (โดยเฉพาะ Logo)
- **การทำงาน:** ใช้ Agent Team ตาม section "Agent Team Workflow" ด้านบน — Lead (session นี้) ไม่เขียน feature code เอง
