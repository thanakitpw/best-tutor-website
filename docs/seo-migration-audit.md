# SEO Migration Audit — besttutorthailand.com

> ตรวจสอบเมื่อ: 2026-04-20
> วิธี: Crawl live site + WebFetch 10+ URLs + sitemap + robots analysis
> เป้าหมาย: รักษา SEO authority ในการย้ายจาก WordPress → Next.js

---

## 🎯 สรุปสำคัญ (TL;DR)

**ข่าวดี:** เว็บเดิมมี SEO implementation **น้อยมาก** — ไม่มี JSON-LD, ไม่มี meta description, ไม่มี OG metadata ส่วนใหญ่ แปลว่า **การ migration จะ improve SEO ทันทีที่ launch** เพราะเว็บใหม่จะมีทุกอย่างครบ

**ข่าวต้องระวัง:** URL structure ในแผน `CLAUDE.md` **ไม่ตรง** กับ URL จริงของเว็บเดิม ต้องตัดสินใจ:
- (A) เปลี่ยนแผน Next.js ให้ตรงเว็บเดิม (แนะนำ) — ไม่ต้อง 301
- (B) เปลี่ยน URL + ทำ 301 redirect map ครบ (เสี่ยง ranking ชั่วคราว)

**ต้องทำ 3 อย่างก่อน Phase 2:**
1. ตัดสินใจ URL strategy (A vs B) → อัปเดต `CLAUDE.md` URL Structure
2. เก็บ backup sitemap + WordPress content export เป็น SEO preservation asset
3. ลิสต์ keyword ที่เว็บเดิมติดอันดับ (ต้องใช้ Google Search Console จากลูกค้า — **สำคัญมาก**)

---

## 1. Robots.txt + Sitemap

### robots.txt
```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-content/uploads/wpforms/

Sitemap: https://besttutorthailand.com/wp-sitemap.xml
```

**วิเคราะห์:** เป็น robots default ของ WordPress ไม่ใช่ของ custom จริง ใช้ทำอ้างอิงเท่านั้น — เว็บใหม่ควรเขียน custom (ไม่มี wp-admin)

### sitemap
- URL: `https://besttutorthailand.com/wp-sitemap.xml` (WordPress core sitemap)
- Has `max-image-preview:large` robots directive (ทำให้ Google ใช้ hero image ใน SERP)

---

## 2. URL Inventory (จาก sitemap)

### Main Pages (5)
| URL | Page Type | Status |
|---|---|---|
| `/` | Homepage | 200 |
| `/tutors/` | Subject listing | 200 |
| `/find-tutor/` | Lead form | 200 |
| `/blog/` | Blog listing | 200 |
| `/join-with-us/` | Tutor recruitment | 200 |

**ไม่พบใน sitemap:** `/tutor-register/`, `/review/` — อาจเป็นหน้าใหม่ที่คุณวางแผนเพิ่ม (ตรวจใน CLAUDE.md)

### Subject Categories (9 main + 18 sub)

**URL pattern จริง:** `/subject/[category]/` และ `/subject/[category]/[sub]/`

**⚠️ สำคัญ:** URL structure ที่ใช้จริง **ต่าง** จากที่วางใน `CLAUDE.md`

| ที่วางใน CLAUDE.md | URL จริงในเว็บเดิม |
|---|---|
| `/subject/english/` | `/subject/foreign-language/english/` |
| `/subject/chinese/` | `/subject/foreign-language/chinese/` |
| `/subject/math/` | `/subject/mathematic/` |
| `/subject/physics/` | `/subject/scient/physics/` |

**URL ที่มีอยู่จริง:**
```
/subject/foreign-language/
  /english/, /chinese/, /japanese/, /korean/
/subject/mathematic/
/subject/scient/
  /physics/, /chemistry/, /biology/, /general-scient/
/subject/thai/
/subject/social-study/
/subject/computer/
/subject/art/
/subject/music/
  /guitar/, /drum/, /dance/, /piano/
/subject/sport/
  /swim/, /taekwondo/, /badminton/, /yoga/
```

**วิชาย่อยที่ขาดจาก CLAUDE.md (แต่มีในเว็บเดิม):**
- `/subject/scient/general-scient/` (วิทย์ทั่วไป)
- ยังไม่เห็น: `/subject/mathematic/calculus/`, `/mathematic/statistic/`, `/mathematic/accounting/` (อาจมีหรือไม่มี ต้อง crawl ลึก)
- ยังไม่เห็น: `/subject/social-study/law/`, `/history/`, `/economic/`
- ยังไม่เห็น: `/subject/computer/basic/`, `/programming/`

### Blog Posts (12 พบใน sitemap — 2026 วันที่ใหม่)

**⚠️ URL pattern: อยู่ที่ ROOT level ไม่ใช่ `/blog/[slug]/`**

```
/tiw-sop-khao-mo-1-rongrian-dang-2026/
/tutor-phasa-kaouli-tua-tor-tua-2026/
/tgat-tpat-a-level-khue-arai-2026/
/rian-phasa-yipun-tutor-tua-tor-tua-2026/
/tiw-tgat-tpat-a-level-tua-tor-tua-2026/
/5-witi-lueak-tutor-tua-tor-tua-2026/
/rian-phiset-online-vs-tam-ban-2026/
/khru-son-phiset-khannit-mathayom-plai-a-level-2026/
/tutor-phasa-jin-tua-tor-tua-wai-thamgan-2026/
/ha-tutor-phasa-angkrit-tua-tor-tua-krungthep-2026/
/ka-khru-son-phiset-tua-tor-tua-2026/
/dek-prathom-khuan-rian-phiset-mai-2026/
```

**Blog category pages** (ที่ `/blog/[category]/`):
```
/blog/english/
/blog/chinese/
/blog/japanese/
/blog/mathematic/
/blog/scient/
/blog/thai/
/blog/social-study/
```

**Observations:**
- Slug ใช้ **romanization Thai** (tua-tor-tua = ตัวต่อตัว) + ลงท้ายด้วยปี (2026)
- มีทั้งหมด 12 บทความ (น้อยมาก — แผนเดิมใน checklist ตั้งเป้า 50+)
- Blog posts อยู่ที่ root `/slug/` ไม่ใช่ `/blog/slug/` — **จะต้องทำ 301 ถ้าเปลี่ยน**

### Tutor Profiles

**URL pattern:** `/tutor/[thai-encoded-slug]/` เช่น `/tutor/กระแต-พรพิมล/`
URL ใช้ **Thai characters** ที่ URL-encoded เช่น `%e0%b8%81%e0%b8%a3%e0%b8%b0...`

ไม่มี sitemap ของ tutor profiles (ไม่พบใน wp-sitemap.xml crawl) — WordPress อาจไม่ได้ index tutor profiles อัตโนมัติ หรืออยู่ใน sub-sitemap

**แนะนำ:** ขอ list ติวเตอร์ครบ 103 คนจากลูกค้า พร้อม slug ที่ใช้อยู่

---

## 3. Metadata per Page (critical findings)

### Homepage `/`
- **Title:** `Best Tutor Thailand` ⚠️ (แค่ brand name — ไม่มี keyword)
- **Meta description:** ❌ ไม่มี
- **H1:** `BEST TUTOR THAILAND` ⚠️ (all caps, brand only)
- **Canonical:** ไม่มี
- **OG image:** ❌ ไม่มี
- **OG tags อื่น ๆ:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มีเลย
- **Word count:** 1,395
- **Robots:** `max-image-preview:large` (OK)

### `/tutors/` (Subject listing)
- **Title:** ไม่เห็นจาก fetch (probably บ่งถึงใน `<head>` แต่ WebFetch ไม่ดึง)
- **H1:** `รายวิชาที่เปิดสอน` ✓
- **Meta desc:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มี

### `/find-tutor/`
- **H1:** `หาติวเตอร์ ครูสอนพิเศษ เรียนแบบตัวต่อตัว` ✓ (ดี — มี keyword)
- **Meta desc:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มี

### `/blog/`
- **Title:** `Blog – Best Tutor Thailand`
- **H1:** `ข่าวสารและบทความ` ✓
- **Meta desc:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มี

### `/join-with-us/`
- **H1:** `สมัครเป็นติวเตอร์` ✓
- **Meta desc:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มี

### `/subject/foreign-language/english/`
- **H1:** `ภาษาอังกฤษ` ⚠️ (สั้นเกินไป — ไม่มี keyword "ติวเตอร์/สอนพิเศษ")

### ตัวอย่าง blog post `/ha-tutor-phasa-angkrit-tua-tor-tua-krungthep-2026/`
- **Title:** `หาติวเตอร์ภาษาอังกฤษตัวต่อตัว กรุงเทพ ที่ไหนดี 2569 – Best Tutor Thailand` ✓✓ (**ดีมาก** — keyword ครบ + location + year)
- **H1:** ตรงกับ title
- **OG image:** ✓ มี `https://besttutorthailand.com/wp-content/uploads/2026/04/หาติวเตอร์ภาษาอังกฤษตัวต่อตัว-กรุงเทพ-ที่ไหนดี.png`
- **Meta desc:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มี (**เสียโอกาส** — Article schema ช่วย rich snippet)
- **Publish date:** April 2, 2026
- **Word count:** ~2,500-3,000 (ดีมาก content-rich)

### ตัวอย่าง tutor profile `/tutor/กระแต-พรพิมล/`
- **H1:** `กระแต พรพิมล` ✓ (ดี — ชื่อครู)
- **Meta desc:** ❌ ไม่มี
- **JSON-LD:** ❌ ไม่มี (**เสียโอกาสใหญ่** — Person + AggregateRating + Review ช่วย rich snippet มาก)
- **Star rating:** ❌ ไม่แสดง (ยังไม่มีระบบรีวิวในเว็บเดิม)

---

## 4. 301 Redirect Map

### สถานการณ์ A: ใช้ URL เว็บเดิม 100% (แนะนำ)

**ไม่ต้อง redirect** — Next.js ใช้ URL pattern เดียวกับเว็บเดิม แต่ต้องอัปเดต `CLAUDE.md`:

```diff
- /subject/[category]/[sub]/page.tsx
+ /subject/foreign-language/[sub]/page.tsx  # หรือใช้ [category]/[sub] ตาม old pattern
+ /subject/mathematic/page.tsx
+ /subject/scient/[sub]/page.tsx

- /blog/[slug]/page.tsx
+ /[slug]/page.tsx                # blog posts ที่ root!
+ /blog/[category]/page.tsx       # blog category pages คงไว้
```

### สถานการณ์ B: ทำความสะอาด URL (อาจเสี่ยง ranking)

```
# Subject URL simplification
/subject/foreign-language/english/ → /subject/english/
/subject/foreign-language/chinese/ → /subject/chinese/
/subject/foreign-language/japanese/ → /subject/japanese/
/subject/foreign-language/korean/ → /subject/korean/
/subject/mathematic/ → /subject/math/
/subject/scient/ → /subject/science/
/subject/scient/physics/ → /subject/physics/
/subject/scient/chemistry/ → /subject/chemistry/
/subject/scient/biology/ → /subject/biology/
/subject/social-study/ → /subject/social/

# Blog URL normalization
/{blog-slug}-2026/ → /blog/{slug}/
/ha-tutor-phasa-angkrit-tua-tor-tua-krungthep-2026/ → /blog/ha-tutor-phasa-angkrit-tua-tor-tua-krungthep-2026/
(ทำทั้ง 12 URLs)
```

**แนะนำ:** ใช้ **สถานการณ์ A** เพราะ:
1. เว็บเดิมมี SEO authority น้อยมาก — ไม่คุ้มเสี่ยง ranking
2. Redirect chains ทำให้ Google crawl ช้าลง
3. ง่ายต่อการ implement

### URL ใหม่ที่ไม่มีในเว็บเดิม (ไม่ต้อง redirect — สร้างใหม่)

- `/tutor-register/` — ฟอร์มสมัครติวเตอร์
- `/review/` — หน้ารีวิว
- `/admin/*` — หลังบ้าน

---

## 5. Existing Schema.org

**❌ ไม่มี JSON-LD ในทุกหน้าที่ crawl**

เว็บเดิม **ไม่มี** structured data เลย — หมายความว่า:
- ไม่มี rich snippets ใน Google SERP
- ไม่มี knowledge panel
- ไม่มี review stars ใน search results

**→ เว็บใหม่ควรใส่ JSON-LD ครบทุกประเภท (ตาม `CLAUDE.md` SEO-First Rules)**

---

## 6. Technical SEO Issues ที่พบในเว็บเดิม

| # | Issue | ผลกระทบ | การแก้ไขในเว็บใหม่ |
|---|---|---|---|
| 1 | ไม่มี `meta description` ทุกหน้า | สูงมาก — Google สร้างเอง (ไม่ control ได้) | `generateMetadata` ทุกหน้า บังคับ |
| 2 | ไม่มี JSON-LD ทุกหน้า | สูงมาก — ไม่มี rich snippet | JSON-LD per page type |
| 3 | Homepage title = brand name เฉย ๆ | สูง — เสีย keyword | Title include "ติวเตอร์ สอนพิเศษ" |
| 4 | ไม่มี canonical URLs | ปานกลาง — risk ของ duplicate content | Canonical บังคับ |
| 5 | ไม่มี OG tags (ยกเว้น blog) | สูง — share บน FB/Line ไม่สวย | OG ครบ + generate ด้วย `next/og` |
| 6 | URL ใช้ Thai encoded ยาว (tutor profiles) | ปานกลาง — อ่านยาก | Transliterate หรือใช้ ID |
| 7 | Blog posts อยู่ root level ไม่ใน `/blog/` | ต่ำ — ไม่ฟัง semantic | ใช้ A (เก็บ) หรือ B (redirect) |
| 8 | `/subject/foreign-language/english/` ยาว | ต่ำ | ใช้ A (เก็บ) หรือ B (ย่อ) |
| 9 | มีบทความแค่ 12 — target 50+ | ปานกลาง | Phase 5 เขียนบทความต่อ |
| 10 | ไม่มีรีวิวในเว็บเดิม | ต่ำ (เป็น feature ใหม่) | Phase 3 + Shopee review system |

---

## 7. Priority Recommendations (ทำก่อน Phase 2)

### 🔴 ต้องทำก่อนเริ่มโค้ด (P0)

1. **ตัดสินใจ URL strategy (A vs B)** → อัปเดต `CLAUDE.md` URL Structure section
2. **ขอ Google Search Console access จากลูกค้า** — ดู:
   - Keywords ที่ติดอันดับ (ห้ามทำลาย ranking)
   - Backlinks ปัจจุบัน (ถ้ามี)
   - Index coverage (กี่ URL ที่ Google รู้จัก)
3. **ขอ export WordPress content** จากลูกค้า:
   - ข้อมูลติวเตอร์ 103 คน (ชื่อ, slug, content)
   - บทความ 12 ตัว (content เต็ม, images)
   - หมวดวิชา + sub-categories ที่ใช้จริง
4. **List URLs ครบจาก Search Console** — บางหน้าอาจไม่อยู่ใน sitemap แต่ถูก index แล้ว

### 🟡 ต้องทำระหว่าง Phase 2-3 (P1)

5. **Prisma schema** ต้องมี SEO fields ตาม CLAUDE.md SEO-First Rules
6. **Slug strategy** สำหรับ tutor:
   - ❌ อย่าใช้ Thai-encoded URL (อ่านยาก, share ยาก)
   - ✅ ใช้ transliteration หรือ nickname-firstname เช่น `/tutor/kratae-pornpimel/`
   - ถ้าเว็บเดิมมี URL Thai อยู่แล้ว → ทำ 301 ไป English slug
7. **Blog URL decision** (สำคัญ):
   - ถ้าใช้ option A: route `/[slug]/page.tsx` catch-all — **อันตราย** ต้อง reserved routes
   - ถ้าใช้ option B: ทำ 301 redirect 12 URLs → `/blog/[slug]/`
   - **แนะนำ:** Option B เพราะ `/blog/[slug]/` สะอาดกว่า + บทความแค่ 12 ตัว redirect เสียหายต่ำ

### 🟢 ทำ Phase 5+ (P2 — Content SEO)

8. เขียนบทความใหม่ 40+ (target รวม 50+)
9. Programmatic SEO: `/subject/[x]/[province]` หน้าวิชา × จังหวัด
10. Featured snippets optimization
11. Internal linking automation

---

## 8. Recommended URL Structure (revised)

หลังวิเคราะห์แล้ว **ขอเสนอปรับ** URL Structure ใน CLAUDE.md ดังนี้:

```diff
# หน้าหลัก — ไม่เปลี่ยน
/ (homepage)
/tutors/
/find-tutor/
/blog/
/join-with-us/
/tutor-register/  ← ใหม่
/review/           ← ใหม่

# Subject — เลือก option

Option A (ตรงเว็บเดิม):
/subject/foreign-language/
/subject/foreign-language/english/
/subject/mathematic/
/subject/scient/
/subject/scient/physics/

Option B (ย่อ — แนะนำ เพราะสะอาดกว่า + 301 ไม่กี่ URL):
/subject/english/       (+ 301: /subject/foreign-language/english/)
/subject/chinese/       (+ 301: /subject/foreign-language/chinese/)
/subject/math/          (+ 301: /subject/mathematic/)
/subject/physics/       (+ 301: /subject/scient/physics/)
/subject/science/       (+ 301: /subject/scient/)

# Blog — ใช้ Option B แนะนำ
/blog/[slug]/           (+ 301 จาก root `/{slug}/` — ทำ 12 URLs)
/blog/[category]/       (ไม่เปลี่ยน)

# Tutor — ใช้ transliterated slug
/tutor/[slug]/
  ตัวอย่าง: /tutor/kratae-pornpimel/
  (+ 301 จาก URL Thai-encoded เดิมถ้าต้องการ — แต่ต้อง list ครบก่อน)
```

---

## 9. Asset Backup Checklist

**ก่อน migration ต้อง backup:**

- [ ] Export WordPress database (`.sql` dump ผ่าน phpMyAdmin)
- [ ] Export WordPress media library (`wp-content/uploads/`)
- [ ] บันทึก `wp-sitemap.xml` ไว้
- [ ] Screenshot หน้าสำคัญทั้งหมด (15 หน้าหลัก + 5 tutor samples + 3 blog posts)
- [ ] Download รูปติวเตอร์ 65 คนที่มีรูป
- [ ] Download รูปบทความทั้ง 12 ตัว (OG images)
- [ ] Download logo + partner logos 29 รูป
- [ ] บันทึก Google Analytics data (ย้อนหลัง 12 เดือน)
- [ ] บันทึก Google Search Console data (keywords, backlinks, coverage)

---

## 10. Keywords ที่ต้องเล็ง (ประมาณการจาก H1 + blog titles)

**Primary keywords:**
- หาติวเตอร์, หาครูสอนพิเศษ
- ติวเตอร์ตัวต่อตัว, ครูสอนพิเศษตัวต่อตัว
- เรียนพิเศษออนไลน์, เรียนพิเศษที่บ้าน
- ติวเตอร์ + [วิชา] เช่น "ติวเตอร์ภาษาอังกฤษ"
- ติวเตอร์ + [วิชา] + [จังหวัด] เช่น "ติวเตอร์ภาษาอังกฤษ กรุงเทพ"

**Secondary keywords (จากบทความจริง):**
- ติว สอบเข้า ม.1, ติว TGAT/TPAT/A-Level
- ติว O-NET, GAT/PAT
- สอน GED, สอน IELTS
- เรียนภาษาเกาหลี, เรียนภาษาญี่ปุ่น, เรียนภาษาจีน
- วิธีเลือกติวเตอร์, วิธีเลือกครูสอนพิเศษ

**→ ใช้ keyword เหล่านี้ใน `generateMetadata` ของเว็บใหม่**

---

## 11. สิ่งที่ Surprising / Non-obvious

1. **เว็บเดิม SEO น้อยมาก** — เป็นโอกาสทอง เว็บใหม่จะ improve อันดับทันทีที่ launch
2. **Blog posts มี OG image แต่หน้าอื่นไม่มี** — แสดงว่าเจ้าของเว็บให้ความสำคัญกับ blog มากกว่า
3. **URL structure เว็บเดิม ≠ แผน CLAUDE.md** — ต้องตัดสินใจด่วน
4. **Blog posts อยู่ root** — uncommon pattern, WordPress default
5. **มีบทความแค่ 12 ตัว** — น้อยมาก มี potential เยอะใน content marketing
6. **Tutor profiles ใช้ Thai-encoded slug** — อ่านยาก, share ยาก, ควรเปลี่ยนเป็น transliterated
7. **Blog titles ใช้ "2569" (พุทธศักราช)** — SEO ควรใช้ ค.ศ. (2026) — แต่ Thai audience อาจ search "2569"
8. **ไม่มี hreflang** — สมเหตุสมผล เว็บภาษาไทยเท่านั้น ไม่ต้องกังวล

---

## 12. Next Actions (สำหรับ Lead)

1. **ถามลูกค้า:**
   - Google Search Console access → ดู keywords จริงที่ติดอันดับ
   - WordPress admin access → export content
   - รายชื่อติวเตอร์ 103 คน + slug ที่ใช้อยู่
   - เป้าหมาย keyword ที่อยากติด (ถ้ามี)
2. **ตัดสินใจ URL strategy** (A vs B)
3. **อัปเดต `CLAUDE.md`** URL Structure section
4. **แจ้ง Backend Dev teammate** ว่า Prisma schema ต้องมี SEO fields
5. **แจ้ง SEO & Content teammate** ว่า audit นี้เป็น reference หลัก

---

> **หมายเหตุ:** Audit นี้ทำจากการ crawl publicly-accessible pages เท่านั้น ยังไม่รวม data จาก Google Search Console หรือ internal analytics — เมื่อได้ access จากลูกค้าแล้ว จะ update เอกสารนี้เพิ่ม
