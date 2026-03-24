# Best Tutor Thailand - Complete Site Structure Documentation

**Crawled:** 2026-03-24
**Source:** https://besttutorthailand.com/
**Platform:** WordPress + Astra Theme + Elementor Page Builder
**Language:** Thai (primary), English (secondary)

---

## Table of Contents

1. [Global Elements (Header, Navigation, Footer)](#1-global-elements)
2. [Homepage](#2-homepage)
3. [Tutors Listing Page](#3-tutors-listing-page)
4. [Subject Category Pages](#4-subject-category-pages)
5. [Subject Sub-Category Pages](#5-subject-sub-category-pages)
6. [Tutor Profile Pages](#6-tutor-profile-pages)
7. [Find Tutor Form Page](#7-find-tutor-form-page)
8. [Blog Index Page](#8-blog-index-page)
9. [Blog Post Template](#9-blog-post-template)
10. [Join With Us Page](#10-join-with-us-page)
11. [Tutor Register Page](#11-tutor-register-page)
12. [Review Page](#12-review-page)
13. [Complete URL Map](#13-complete-url-map)
14. [Subject Taxonomy (Full Data)](#14-subject-taxonomy-full-data)
15. [Tutor Data Summary](#15-tutor-data-summary)

---

## 1. Global Elements

### 1.1 Header / Navigation Bar

**Background:** White (#ffffff)
**Layout:** Horizontal, logo left-aligned, menu right-aligned
**Sticky:** No (standard positioning)
**Max Width:** ~1200px centered

**Logo:**
- Image file: `Logo.png` (located at `/wp-content/uploads/2024/12/`)
- Links to: `/` (homepage)
- Size: ~120px width

**Main Navigation Menu Items:**

| Menu Item | URL | Has Submenu |
|---|---|---|
| หน้าแรก (Home) | `/` | No |
| รายวิชาที่เปิดสอน (Subjects) | `/tutors/` | Yes (mega dropdown) |
| หาครูสอนพิเศษ (Find Tutor) | `/find-tutor/` | No |
| บทความ (Blog) | `/blog/` | No |
| สมัครเป็นติวเตอร์ (Join as Tutor) | `/join-with-us/` | No |

**Subjects Dropdown Submenu Structure:**

```
รายวิชาที่เปิดสอน
├── ภาษาต่างประเทศ (/subject/foreign-language/)
│   ├── ภาษาอังกฤษ (/subject/foreign-language/english/)
│   ├── ภาษาจีน (/subject/foreign-language/chinese/)
│   ├── ภาษาญี่ปุ่น (/subject/foreign-language/japanese/)
│   └── ภาษาเกาหลี (/subject/foreign-language/korean/)
├── คณิตศาสตร์ (/subject/mathematic/)
├── วิทยาศาสตร์ (/subject/scient/)
│   ├── ฟิสิกส์ (/subject/scient/physics/)
│   ├── เคมี (/subject/scient/chemistry/)
│   ├── ชีววิทยา (/subject/scient/biology/)
│   └── วิทยาศาสตร์ทั่วไป (/subject/scient/general-scient/)
├── ภาษาไทย (/subject/thai/)
├── สังคมศึกษา (/subject/social-study/)
├── คอมพิวเตอร์ (/subject/computer/)
├── ศิลปะ (/subject/art/)
├── ดนตรี (/subject/music/)
│   ├── กีต้าร์ (/subject/music/guitar/)
│   ├── ตีกลอง (/subject/music/drum/)
│   ├── เต้น (/subject/music/dance/)
│   └── เปียโน (/subject/music/piano/)
└── กีฬา (/subject/sport/)
    ├── ว่ายน้ำ (/subject/sport/swim/)
    ├── เทควันโด (/subject/sport/taekwondo/)
    ├── แบดมินตัน (/subject/sport/badminton/)
    └── โยคะ (/subject/sport/yoga/)
```

**Mobile Navigation:**
- Hamburger menu toggle at breakpoint 922px
- Trigger type: "Minimal" (hamburger icon)

**Text Colors:**
- Default: #334155 (dark gray)
- Hover: #045cb4 (blue)
- Active: #045cb4 (blue)

---

### 1.2 Footer

**Background:** White (#ffffff) with top border 1px solid #eaeaea
**Layout:** Multi-column, max-width ~1200px centered
**Min Height:** 60px

**Footer Content:**

**Column 1 - Brand:**
- Logo image (variant without background: `Logo-ไม่มีพื้นหลัง.png`)
- Tagline: "เรามุ่งมั่นจับคู่ผู้เรียนกับติวเตอร์ระดับแนวหน้า พร้อมนำทางคุณสู่ความสำเร็จ" (We aim to match learners with premier-level tutors ready to guide you to success)

**Column 2 - Quick Links:**
- หาครูสอนพิเศษ (Find Tutor) -> `/find-tutor/`
- Subject categories links (ภาษาไทย, คณิตศาสตร์, วิทยาศาสตร์, etc.)

**Column 3 - Social Media Icons:**
- Facebook -> facebook.com/besttutorthailand
- Instagram -> instagram.com/besttutor_th
- LINE -> lin.ee/jL50860
- TikTok -> (TikTok account)

---

## 2. Homepage

**URL:** `https://besttutorthailand.com/`
**Meta Title:** "Best Tutor Thailand"

### Section 2.1: Hero Banner

**Background:** Dark gradient/solid dark background
**Layout:** Full-width banner with centered content
**Content:**
- Main Heading: "BEST TUTOR THAILAND"
- Subheading: "Empower your success"
- CTA Button: "ค้นหาครูสอนพิเศษ คลิก" (Find Tutors - Click)
  - Color: Blue (#046bd2)
  - Hover: #045cb4
  - Links to: `/find-tutor/`

### Section 2.2: Curriculum Selection (เลือกหลักสูตร)

**Background:** White / Light (#F0F5FA)
**Layout:** Grid of subject cards (5 cards)
**Heading:** "เลือกหลักสูตร" (Choose Curriculum)
**Subheading:** "รายวิชาที่ท่านสนใจ" (Subjects You're Interested In)

**Subject Cards:**

| # | Subject | Image | Link |
|---|---|---|---|
| 1 | ภาษาไทย (Thai) | subject_3.png | /subject/thai/ |
| 2 | สังคมศึกษา (Social Studies) | subject_5.png | /subject/social-study/ |
| 3 | คณิตศาสตร์ (Mathematics) | subject_1.png | /subject/mathematic/ |
| 4 | วิทยาศาสตร์ (Science) | subject_2.png | /subject/scient/ |
| 5 | ภาษาต่างประเทศ (Foreign Languages) | subject_4.png | /subject/foreign-language/ |

**View All Link:** "ดูหลักสูตรทั้งหมด" (View All Courses) -> `/tutors/`

### Section 2.3: Featured Courses (คอร์สเรียนแนะนำ)

**Background:** White
**Layout:** 4-column card grid
**Heading:** "คอร์สเรียนแนะนำ" (Recommended Courses)

**Course Cards:**

| # | Title | Image | Features | Duration |
|---|---|---|---|---|
| 1 | คอร์สภาษาจีน พูดเก่งตั้งแต่เด็ก (Chinese for Kids) | Chinese-Kid-1024x646.jpg | - สอนสด ใช้ภาษาจีนตลอดชั่วโมง ฝึกฟัง-พูดให้คล่อง | 30 ชม. |
| | | | - เรียนสนุกผ่านเกม เพลง และกิจกรรมเสริมทักษะ | |
| 2 | คอร์สภาษาจีน สำหรับวัยทำงาน (Business Chinese) | Business-Chinese-1024x646.jpg | - ใช้ภาษาจีนได้จริง ฝึกฟัง-พูดผ่านบทบาทสมมุติ | 30 ชม. |
| | | | - ฝึกโต้ตอบ ผ่านสถานการณ์จำลอง ด้วยบทสนทนาเชิงธุรกิจ | |
| 3 | คอร์สติวสอบ IELTS (IELTS Prep) | IELTS-1024x646.jpg | - ติวครบทุกพาร์ต Listening, Reading, Writing, Speaking | 30 ชม. |
| | | | - ฝึกทำข้อสอบจริง เจาะลึกโครงสร้างข้อสอบเก่า | |
| 4 | คอร์สคณิตศาสตร์ เพิ่มเกรด-สอบเข้า (Math Grade+Entrance) | Math-1024x646.jpg | - ปูพื้นฐานสู่ความเป็นเลิศ ติวเข้มตามหลักสูตร | 30 ชม. |
| | | | - เทคนิคคิดเลขเร็ว พร้อมวิธีลัด แก้โจทย์ไว | |

### Section 2.4: Popular Tutors (ติวเตอร์ที่ได้รับความนิยม)

**Background:** White/Light
**Layout:** Carousel or grid
**Heading:** "แนะนำ" (Recommendations)
**Subheading:** "ติวเตอร์ที่ได้รับความนิยม" (Popular Tutors)

- Shows 6 tutors visible at a time in a carousel with left/right navigation arrows
- 12 tutors total marked as "popular" (based on taxonomy: popular_tutors)
- **Background:** Dark blue gradient (น้ำเงินเข้ม gradient)
- Each card shows:
  - Round profile photo (circular crop)
  - Nickname + Full name (Thai)
  - Gold star rating row (5 stars, ★★★★★ in #FFB900)
- Cards link to individual tutor profile pages (`/tutor/[slug]/`)
- Carousel has white left/right arrow buttons

### Section 2.5: Reviews (รีวิวจริงจากสถาบัน)

**Background:** Light gray / White
**Layout:** 3-card carousel with navigation arrows
**Heading:** "คู่มือ" (Guide)
**Subheading:** "รีวิวจริงจากสถาบัน" (Real Reviews from Institutions)

- 3 review cards visible at a time
- Each review card:
  - Quote text (review content)
  - Reviewer avatar (circular, gold-bordered)
  - Reviewer name
  - Gold star rating (★★★★★)
- Left/right navigation arrows
- Cards have light background with subtle border

### Section 2.6: News & Articles (ข่าวสารและบทความ)

**Background:** White
**Layout:** Mixed layout — 1 large card left + 3 smaller cards right
**Heading:** "ข่าวสารและบทความ" (News & Articles)

- **Large card (left):**
  - Featured image
  - Article title
  - Excerpt text
  - "อ่านเพิ่มเติม >" (Read more) link
- **Small cards (right, 3 cards stacked):**
  - Thumbnail image (left) + title + excerpt (right)
  - "อ่านเพิ่มเติม" link
- **CTA Button:** "ดูบทความและบทความเพิ่มเติม" (View More Articles)
  - Blue (#046bd2) background, white text
  - Centered below the cards

### Section 2.7: Our Customers (OUR CUSTOMERS / BEST TUTOR THAILAND)

**Background:** Blue gradient (น้ำเงินอ่อน gradient)
**Layout:** Logo grid, centered
**Heading:** "OUR CUSTOMERS" (English)
**Subheading:** "BEST TUTOR THAILAND"

- ~30 partner/customer logos arranged in rows
- Logos include: Canon, PSP, Chill Media, elt, Summit, KDK, GAVAN, TR:DS, และอื่น ๆ
- Logo images from: `/wp-content/uploads/2025/01/partner_icon_*.png`
- All logos displayed in their original colors (not grayscale)

### Section 2.8: About Us (เกี่ยวกับเรา)

**Background:** White
**Layout:** Full-width text block + 4 info icons below
**Heading:** "เกี่ยวกับเรา" (About Us)

**Content:**
- Company history text (ก่อตั้งปี พ.ศ. 2561 / 2018)
- ได้รับรางวัล Shark Tank Thailand
- ข้อมูลสถิติ: 50,000 นักเรียน, 100+ เครือข่ายสถาบัน

**4 Info Icons (bottom row):**

| Icon | Label | Detail |
|---|---|---|
| ✉️ | Email Us | contact@besttutorthailand.com |
| 📞 | Phone Number | 099-189-5222 |
| 🏢 | Office Location | 19/32 Home Office Grande, Phetkasem 81 Yeak Nong Kang Plu, Nong Khaem, Bangkok 10160 |
| 📅 | Work Day | Mon-Fri 09.30-21.30, Sat-Sun 09.30-18.00 |

---

## 3. Tutors Listing Page

**URL:** `https://besttutorthailand.com/tutors/`
**Meta Title:** "รายวิชาที่เปิดสอน" (Subjects Offered)

### Section 3.1: Page Header

**Background:** Dark blue gradient with blurred image overlay (คล้าย Hero หน้าแรก)
**Layout:** Full-width, centered text
**Heading:** "รายวิชาที่เปิดสอน" (Subjects Offered) — สีขาว, ขนาดใหญ่

### Section 3.2: Subject Category Blocks

**Background:** White
**Layout:** แต่ละหมวดมี heading + grid ของ image cards
**Card Style:** รูปภาพเต็มพื้นที่ + ชื่อวิชาซ้อนอยู่ด้านล่าง (text overlay บน image)
**Card Size:** ~280x170px, border-radius ~8px
**Grid:** 3 คอลัมน์ (ไม่ครบ 3 จะเว้นว่าง)

**Block: ภาษาต่างประเทศ (Foreign Languages)**
| # | วิชา | รูป | Link |
|---|---|---|---|
| 1 | ภาษาอังกฤษ | ธงอังกฤษ | /subject/foreign-language/english/ |
| 2 | ภาษาจีน | ตัวอักษรจีน | /subject/foreign-language/chinese/ |
| 3 | ภาษาญี่ปุ่น | ภูเขาฟูจิ | /subject/foreign-language/japanese/ |
| 4 | ภาษาเกาหลี | ธงเกาหลี | /subject/foreign-language/korean/ |

**Block: คณิตศาสตร์ (Mathematics)**
| # | วิชา | รูป | Link |
|---|---|---|---|
| 1 | แคลคูลัส | สมการบนกระดาน | /subject/mathematic/calculus/ |
| 2 | บัญชี | เครื่องคิดเลข+เอกสาร | /subject/mathematic/accounting/ |
| 3 | สถิติ | กราฟ/chart | /subject/mathematic/statistics/ |
| 4 | คณิตศาสตร์ทั่วไป | สัญลักษณ์คณิต | /subject/mathematic/ |

**Block: วิทยาศาสตร์ (Sciences)**
| # | วิชา | รูป | Link |
|---|---|---|---|
| 1 | ฟิสิกส์ | สูตรฟิสิกส์ | /subject/scient/physics/ |
| 2 | เคมี | หลอดทดลอง | /subject/scient/chemistry/ |
| 3 | ชีววิทยา | กล้องจุลทรรศน์ | /subject/scient/biology/ |
| 4 | วิทยาศาสตร์ทั่วไป | อุปกรณ์วิทย์ | /subject/scient/general-scient/ |

**Block: ภาษาไทย (Thai Language)** — 1 card
| # | วิชา | Link |
|---|---|---|
| 1 | ภาษาไทย | /subject/thai/ |

**Block: สังคมศึกษา (Social Studies)**
| # | วิชา | Link |
|---|---|---|
| 1 | กฎหมาย | /subject/social-study/law/ |
| 2 | ประวัติศาสตร์ | /subject/social-study/history/ |
| 3 | เศรษฐศาสตร์ | /subject/social-study/economics/ |

**Block: คอมพิวเตอร์ (Computer)** — 1 card
| # | วิชา | Link |
|---|---|---|
| 1 | คอมพิวเตอร์เบื้องต้น | /subject/computer/ |

**Block: ศิลปะ (Art)**
| # | วิชา | Link |
|---|---|---|
| 1 | การวาดภาพ | /subject/art/drawing/ |
| 2 | ออกแบบกราฟิก | /subject/art/graphic-design/ |

**Block: ดนตรี (Music)** — ไม่เห็นใน screenshot (อยู่ด้านล่าง)
**Block: กีฬา (Sports)** — ไม่เห็นใน screenshot (อยู่ด้านล่าง)

**Footer:** เหมือน Homepage — พื้นหลังน้ำเงินเข้ม, Logo, 4 คอลัมน์, Social icons (FB, IG, LINE, TikTok)

---

## 4. Subject Category Pages

**URL Pattern:** `/subject/[category]/`
**Example:** `/subject/foreign-language/`
**Meta Title:** "[Category Name] - Best Tutor Thailand"

### Page Structure:

**Section 4.1: Hero Banner**
- Background: Dark or themed
- Heading: Category name (e.g., "ภาษาต่างประเทศ")
- Tagline: "เป้าหมายของคุณ ความสำเร็จของเรา" / "Empower your Success"
- CTA: "ติวเตอร์[category]ทั้งหมด" -> anchors to #tutor section

**Section 4.2: Sub-Category Links**
- Grid of sub-category cards linking to sub-subject pages
- Example for Foreign Language:
  - ภาษาอังกฤษ -> `/subject/foreign-language/english/`
  - ภาษาจีน -> `/subject/foreign-language/chinese/`
  - ภาษาญี่ปุ่น -> `/subject/foreign-language/japanese/`
  - ภาษาเกาหลี -> `/subject/foreign-language/korean/`

**Section 4.3: Tutor Cards (id="tutor")**
- Grid of tutor profile cards for this subject
- Each card: profile image, nickname + name, subjects taught
- Links to `/tutor/[slug]/`

---

## 5. Subject Sub-Category Pages

**URL Pattern:** `/subject/[category]/[sub]/`
**Example:** `/subject/foreign-language/english/`
**Meta Title:** "[Sub-Subject Name] - Best Tutor Thailand"

### Page Structure:

**Section 5.1: Hero Banner**
- **Background:** Dark blue gradient with blurred image overlay (เช่น ธงอังกฤษเบลอสำหรับวิชาภาษาอังกฤษ)
- **Layout:** Centered text
- **Small text above heading:** "เรียนพิเศษตัวต่อตัว" (One-on-one tutoring)
- **Heading:** วิชา (e.g., "ภาษาอังกฤษ") — สีขาว, ขนาดใหญ่มาก
- **Tagline:** "เป้าหมายของคุณ ความสำเร็จของเรา" + "Empower your Success" (2 บรรทัด)
- **CTA Button:** "ติวเตอร์ภาษาอังกฤษทั้งหมด" — outlined white border, white text
  - Links to: `#tutor` (scroll to tutor section)

**Section 5.2: Tutor Listing — แนะนำ / ติวเตอร์[วิชา]**
- **Background:** White / Light gray (#F0F5FA)
- **Heading:** "แนะนำ" (small, muted)
- **Subheading:** "ติวเตอร์ภาษาอังกฤษ" (large, bold, น้ำเงิน #046bd2)
- **Layout:** Grid 3 คอลัมน์
- **Card Style (Tutor Card):**
  - รูปโปรไฟล์ขนาดใหญ่ (~280x350px) — border-radius ~15px, box-shadow
  - ชื่อติวเตอร์: "ติวเตอร์ [ชื่อเล่น] [ชื่อจริง]" — ตัวหนา, สีเทาเข้ม
  - **CTA Button ใต้ชื่อ:** "ดูประวัติติวเตอร์ [ชื่อเล่น] [ชื่อจริง]"
    - Background: น้ำเงิน #046bd2, ตัวอักษรขาว, border-radius ~4px
    - Full width ของ card
  - ไม่แสดง: ราคา, คะแนนรีวิว, วิชาที่สอน, ประสบการณ์
- **Pagination/Load more:** ปุ่ม "ดูเพิ่มเติม" (Load More) ตรงกลางด้านล่าง
- **จำนวนติวเตอร์:** แสดง ~9 คนต่อหน้า (3x3 grid), กด "ดูเพิ่มเติม" เพื่อโหลดเพิ่ม

**Section 5.3: Why Study with Best Tutor (เรียนพิเศษ[วิชา]กับ BEST TUTOR THAILAND ได้อะไร?)**
- **Background:** Light blue-gray gradient
- **Heading:** "เรียนพิเศษภาษาอังกฤษกับ BEST TUTOR THAILAND ได้อะไร ?"
- **Layout:** Grid 3 คอลัมน์ x 2 แถว = 6 benefit cards
- **Benefit Cards:**

| # | Icon | Title | Description |
|---|---|---|---|
| 1 | Shield icon | การันตีคุณภาพ | ครูผ่านการคัดเลือก ทดสอบความสามารถ |
| 2 | Person icon | หลักสูตรเฉพาะบุคคล | ออกแบบเนื้อหาตามเป้าหมายของผู้เรียน |
| 3 | Clock icon | เลือกวันและเวลาเองได้ | กำหนดเวลาเรียนตามความสะดวก |
| 4 | Refresh icon | เปลี่ยนติวเตอร์ไม่จำกัด | ไม่พอใจเปลี่ยนได้ไม่มีค่าใช้จ่าย |
| 5 | Headset icon | แอดมินคอยให้บริการทุกวัน | ทีมซัพพอร์ตตลอดเวลา |
| 6 | Certificate icon | ใบรับรองอย่างมืออาชีพ | ติวเตอร์มีวุฒิและใบรับรอง |

- Card style: ไอคอนวงกลมสีน้ำเงินอ่อน + หัวข้อตัวหนา + คำอธิบาย

**Section 5.4: Study Format (เรียนแบบไหนให้ได้ผลเร็วที่สุด?)**
- **Background:** White
- **Layout:** 2 คอลัมน์ — ข้อความซ้าย + รูปโฆษณาขวา
- **Left column:**
  - Heading: "เรียนแบบไหนให้ได้ผลเร็วที่สุด?"
  - ข้อความอธิบายข้อดีของการเรียนตัวต่อตัว
  - Bullet list (checkmarks):
    - อาจารย์ เรียนตัวต่อตัว
    - สะดวกไม่ต้องเดินทาง
    - ปรับรูปแบบ เนื้อหาตามผู้เรียน
    - บทเรียนทำซ้ำได้ ไม่ต้องเดินทางซ้ำ
    - สะดวกในสถานที่ที่ชอบ ไม่ว่าจะเรียนที่ไหน
  - ข้อความล่าง: "ติวเตอร์ที่ทำหลากหลายประเภทให้เลือก ไม่ว่าจะเรียนจะเล่น ไม่ว่าจะที่ไหนก็สะดวกสบาย"
- **Right column:**
  - รูปโฆษณา/promotional banner สีน้ำเงิน+ทอง
  - ข้อความ "ทำไม? การเรียนกับติวเตอร์ ถึงเห็นผลเร็วกว่า?"

---

## 6. Tutor Profile Pages

**URL Pattern:** `/tutor/[slug]/`
**Example:** `/tutor/ตอง-ชวิมน/` (URL-encoded Thai)
**Meta Title:** "[Nickname FullName] - Best Tutor Thailand"
**Total Tutors:** 500+ profiles (from sitemap)

### Page Template Structure (จาก screenshot: ติวเตอร์ ต้นอ้อ ภคกรณ์)

**Layout:** 2 คอลัมน์ — รูปซ้าย + ข้อมูลขวา

**Section 6.1: Profile Photo (ซ้าย)**
- รูปโปรไฟล์ขนาดใหญ่ ~40% ความกว้างหน้าจอ
- รูปเต็มตัว/ครึ่งตัว ไม่ใช่แค่หน้า
- border-radius: 0 (ไม่มีมุมโค้ง)
- ติดขอบซ้ายของหน้า (full-height left column)

**Section 6.2: Profile Info (ขวา)**
- **ชื่อ:** "ติวเตอร์ [ชื่อเล่น]" สีน้ำเงินเข้ม + "[ชื่อจริง]" สีน้ำเงินอ่อน/ทอง
- **ประวัติการศึกษา** (มี icon 📋):
  - "กำลังศึกษาระดับปริญญาตรี คณะครุศาสตร์ สาขาการศึกษาปฐมวัย จุฬาลงกรณ์มหาวิทยาลัย"
- **เบอร์โทร:** icon โทรศัพท์ + "099-189-5222" (เบอร์กลางบริษัท)
- **LINE:** icon LINE สีเขียว + "@besttutor"
- **คุณสมบัติ** (checkmarks สีน้ำเงิน ☑️):
  - ระดับมัธยมศึกษาตอนต้น สอบติดโครงการแลกเปลี่ยน AFS
  - ระดับมัธยมศึกษาตอนปลายจากโรงเรียนพิบูลวิทยาลัย ห้องเรียนพิเศษ SMTE
  - ไป work & travel ที่สหรัฐอเมริกาเป็นเวลา 3 เดือน
  - เคยเป็นติวเตอร์ที่บ้าน เนื่องจากที่บ้านรับสอนพิเศษวิชาภาษาไทย

**Section 6.3: Teaching Experience (ประสบการณ์สอน)**
- มี icon 📚 + heading "ประสบการณ์สอน"
- Checkmarks (✓):
  - สอนภาษาไทย / ภาษาอังกฤษ / คณิตศาสตร์ในระดับชั้นอนุบาล – ประถมศึกษา
  - สามารถสอนภาษาอังกฤษในเชิงการอ่าน – การเขียน
  - โรงเรียนที่เคยสอน: (bullet list)
    - รร.เซนต์คาเบรียล
    - รร.พระวรสาร
    - รร.อนุบาลบ้านหมี่

**Section 6.4: Work Samples (ตัวอย่างผลงาน)**
- Heading: 📍 "ตัวอย่างผลงาน"
- **Image carousel** with left/right arrows
- พื้นหลังสีเข้ม/ดำ
- แสดงรูปผลงานการสอน, ผลสอบนักเรียน ฯลฯ

**Section 6.5: Footer**
- เหมือน Footer ของทุกหน้า (น้ำเงินเข้ม)

**Floating Chat Buttons (มุมขวาล่าง):**
- ปุ่ม Messenger (สีน้ำเงิน)
- ปุ่ม LINE (สีเขียว)
- ปุ่มปิด (X สีแดง)

**Notable — ไม่มีในหน้าโปรไฟล์:**
- ราคา/อัตราค่าสอน
- คะแนนรีวิว/ดาว
- ปุ่มจอง/นัดเรียน
- รายละเอียดแนวการสอน
- ที่อยู่/พื้นที่สอน
- ข้อมูลยานพาหนะ

**ทุกการติดต่อ** ผ่านเบอร์กลาง 099-189-5222 และ LINE @besttutor เท่านั้น

---

## 7. Find Tutor Form Page

**URL:** `https://besttutorthailand.com/find-tutor/`
**Meta Title:** "หาครูสอนพิเศษ - Best Tutor Thailand"

### Layout (จาก screenshot)

**Background:** แบ่ง 2 ส่วน
- **ซ้าย ~30%:** รูป illustration สีน้ำเงิน (คนนั่งอ่านหนังสือ + หลอดไฟ + หนังสือ + chat bubbles) — พื้นหลังสีน้ำเงินอ่อน gradient
- **ขวา ~70%:** ฟอร์มบนพื้นขาว

### Section 7.1: Form Header

**Heading:** "หาติวเตอร์ ครูสอนพิเศษ เรียนแบบตัวต่อตัว" — ข้อความสีน้ำเงินเข้ม, centered, ขนาดใหญ่
**อยู่เหนือฟอร์ม** บนพื้นหลังขาว

### Section 7.2: Multi-Step Form (5 Steps)

**Form Platform:** WPForms
**Progress Bar:** แถบสีน้ำเงิน (#046bd2) ด้านบนฟอร์ม แสดงความคืบหน้า (Step 1 ≈ 25%)
**Form Container:** Card สีขาว, border-radius, shadow เบา ๆ, centered

#### Step 1: Subject Selection (จาก screenshot)

**Field 1: วิชาที่ต้องการหาครูสอนพิเศษ** (Subject Needed) *
- Type: **Radio buttons** (ไม่ใช่ dropdown) — Layout 4 คอลัมน์
- Required: Yes (มี * สีแดง)
- Options (20 วิชา จัดเป็น 4 คอลัมน์):

| คอลัมน์ 1 | คอลัมน์ 2 | คอลัมน์ 3 | คอลัมน์ 4 |
|---|---|---|---|
| ภาษาอังกฤษ | คณิตศาสตร์ | กีฬา | |
| ภาษาจีน | แคลคูลัส | ศิลปะ | |
| ภาษาญี่ปุ่น | บัญชี | คอมพิวเตอร์ | |
| ภาษาไทย | วิทยาศาสตร์ | ดนตรี | |
| ภาษาเกาหลี | ฟิสิกส์ | สังคมศึกษา | |
| ภาษาฝรั่งเศส | เคมี | อื่นๆ | |
| ภาษาเยอรมัน | ชีววิทยา | | |

- **CTA Button:** "ดำเนินการต่อ" (Proceed)
  - Background: น้ำเงิน #046bd2, ตัวอักษรขาว
  - ชิดซ้าย, border-radius ~4px

#### Step 2-5: (ข้อมูลเดิมจาก crawl ยังถูกต้อง)

**Footer:** เหมือนทุกหน้า — น้ำเงินเข้ม, 4 คอลัมน์

**Floating Chat:** Messenger (น้ำเงิน) + LINE (เขียว) มุมขวาล่าง

---

### NOTE — ข้อมูลเดิมด้านล่างยังถูกต้อง เก็บไว้เป็น reference:

**Field 1: วิชาที่ต้องการหาครูสอนพิเศษ** (Subject Needed)
- Type: Radio buttons (4 columns)
- Required: Yes
- Options (20 subjects):
  1. ภาษาอังกฤษ (English)
  2. คณิตศาสตร์ (Mathematics)
  3. กีฬา (Sports)
  4. ภาษาจีน (Chinese)
  5. แคลคูลัส (Calculus)
  6. ศิลปะ (Art)
  7. ภาษาญี่ปุ่น (Japanese)
  8. บัญชี (Accounting)
  9. คอมพิวเตอร์ (Computer)
  10. ภาษาไทย (Thai)
  11. วิทยาศาสตร์ (Science)
  12. ดนตรี (Music)
  13. ภาษาเกาหลี (Korean)
  14. ฟิสิกส์ (Physics)
  15. สังคมศึกษา (Social Studies)
  16. ภาษาฝรั่งเศส (French)
  17. เคมี (Chemistry)
  18. อื่นๆ (Other)
  19. ภาษาเยอรมัน (German)
  20. ชีววิทยา (Biology)

**Conditional Sub-Fields (appear based on subject):**

| Condition | Field Label | Type | Options |
|---|---|---|---|
| Sports selected | ระบุวิชากีฬา | Dropdown | ว่ายน้ำ, ฟุตบอล, บาสเกตบอล, เทนนิส, กอล์ฟ, โยคะ, ฟิตเนส, แบตมินตัน, อื่นๆ |
| Art selected | ระบุวิชาศิลปะ | Dropdown | วาดภาพ, งานปั้น, สถาปัตย์, ออกแบบ, อื่นๆ |
| Computer selected | ระบุวิชาคอมพิวเตอร์ | Dropdown | Microsoft Office, ตัดต่อวิดีโอ, เขียนโปรแกรม, คอมพิวเตอร์กราฟิก, ทำเว็บไซต์, อื่นๆ |
| Music selected | ระบุวิชาดนตรี | Dropdown | เต้น, กีตาร์, กลอง, เบส, เปียโน, ดนตรีไทย, ร้องเพลง, นาฏศิลป์, คีย์บอร์ด, อื่นๆ |
| Social Studies selected | ระบุวิชาสังคมศึกษา | Dropdown | สังคมทั่วไป, ประวัติศาสตร์, เศรษฐศาสตร์, กฎหมาย, อื่นๆ |
| Other/general selected | ระบุวิชาที่ต้องการ | Text Input | Free text |

**Navigation:** "ดำเนินการต่อ" (Continue) button

---

#### Step 2: Learning Goal

**Field 2A: เป้าหมายในการเรียน** (Learning Goal)
- Type: Radio buttons
- Required: Yes

**Options vary by subject type:**

For Vocational subjects (Sports/Art/Music/Computer):
- เป็นงานอดิเรก (Hobby/Recreation)
- เพิ่มเกรด (Improve Grades)
- สอบเข้าสถานศึกษา (Entrance Exam)
- ใช้ในการแข่งขัน (Competition)
- ต้องการเป็นมืออาชีพ (Professional Development)
- ใช้แสดงในวงดนตรี (Perform in Band) - Music only

For Languages:
- เพิ่มเกรด (Improve Grades)
- ติวสอบ (Exam Preparation)
- ใช้ในชีวิตประจำวัน / ท่องเที่ยว (Daily Use/Travel)
- ใช้ในการทำงาน (Work-related)
- เพื่อการศึกษาต่อต่างประเทศ (International Education)

For Academic subjects:
- เพิ่มเกรด (Improve Grades)
- ติวสอบ (Exam Preparation)

**Conditional Field 2B: ต้องการติวสอบอะไร** (Exam Type)
- Type: Radio buttons
- Shown when: "ติวสอบ" selected
- Required: Yes (when shown)

**Exam options by subject:**

| Subject | Exam Options |
|---|---|
| English | กลางภาค-ปลายภาค, A-LEVEL, TOEIC, IELTS, TOEFL, IGCSE, อื่นๆ |
| Chinese | กลางภาค-ปลายภาค, A-Level, HSK 1-3, HSK 4-6, HSKK, สอบอื่นๆ |
| Japanese | กลางภาค-ปลายภาค, A-Level, JLPT (N3-N5), JLPT (N1-N2), สอบอื่นๆ |
| Korean | กลางภาค-ปลายภาค, A-Level, TOPIK, สอบอื่นๆ |
| Thai/Social/Computer | กลางภาค-ปลายภาค, A-Level, ก.พ., IGCSE, สอบอื่นๆ |
| Mathematics | กลางภาค-ปลายภาค, A-Level, ก.พ., Asmo, SAT, IGCSE, โอลิมปิก-สอวน., สอบอื่นๆ |
| Science | กลางภาค-ปลายภาค, A-Level, TPAT3, IGCSE, โอลิมปิก-สอวน., สอบอื่นๆ |

**Navigation:** "ย้อนกลับ" (Back) + "ดำเนินการต่อ" (Continue)

---

#### Step 3: Student Age/Level

**Field 3: วัยของผู้เรียน** (Student Age/Level)
- Type: Radio buttons
- Required: Yes
- Options:
  1. อนุบาล (Kindergarten)
  2. ประถม (Primary/Elementary)
  3. มัธยมต้น (Junior High School)
  4. มัธยมปลาย (High School)
  5. มหาวิทยาลัย (University)
  6. ผู้ใหญ่ (Adult)

**Navigation:** "ย้อนกลับ" (Back) + "ดำเนินการต่อ" (Continue)

---

#### Step 4: Location Selection

**Field 4A: จังหวัด** (Province)
- Type: Dropdown/Select
- Required: Yes
- Placeholder: "กรุณาเลือกจังหวัด" (Please select province)
- Options: All 77 Thai provinces (dynamically loaded)

**Field 4B: อำเภอ** (District)
- Type: Dropdown/Select
- Required: Yes
- Placeholder: "กรุณาเลือกอำเภอ" (Please select district)
- Options: Dynamically loaded based on province selection

**Navigation:** "ย้อนกลับ" (Back) + "ดำเนินการต่อ" (Continue)

---

#### Step 5: Contact Information

**Field 5A: ชื่อ-นามสกุล** (Full Name)
- Type: Text input
- Required: Yes

**Field 5B: อีเมล** (Email)
- Type: Email input
- Required: No
- Placeholder: "(ถ้ามี)" (If available)

**Field 5C: เบอร์ติดต่อ** (Phone Number)
- Type: Text input
- Required: Yes

**Field 5D: Line ID**
- Type: Text input
- Required: No
- Placeholder: "(ถ้ามี)" (If available)

**Submit Button:**
- Text: "หาครูสอนพิเศษ" (Find Tutor)
- Color: Blue background, white text
- Loading spinner on submit

---

## 8. Blog Index Page

**URL:** `https://besttutorthailand.com/blog/`
**Meta Title:** "บทความ - Best Tutor Thailand"

### Section 8.1: Page Header (จาก screenshot)

**Background:** น้ำเงินเข้ม gradient + blurred image overlay (เหมือนหน้าอื่น ๆ)
**Heading:** "ข่าวสารและบทความ" — สีขาว, ขนาดใหญ่, centered
**Subheading:** "อัปเดตข่าวสาร และแชร์ความรู้ในด้านวิชาต่างๆ" — สีขาว opacity 80%

### Section 8.2: Blog Layout (2 คอลัมน์)

**Layout:** Sidebar ซ้าย (25%) + Content ขวา (75%)

**Sidebar ซ้าย — หมวดหมู่:**
- Heading: "หมวดหมู่" (Categories)
- ปุ่มแรก "บทความทั้งหมด" — สีน้ำเงิน #046bd2, ตัวอักษรขาว (active state)
- รายการหมวดหมู่แนวตั้ง (plain text links):
  - ภาษาไทย
  - สังคมศึกษา
  - คณิตศาสตร์
  - วิทยาศาสตร์
  - ภาษาอังกฤษ
- **Sidebar ซ้ำอีกครั้งด้านล่าง** (หลังบทความ rows แรก ๆ):
  - คณิตศาสตร์
  - วิทยาศาสตร์
  - ภาษาอังกฤษ
  - ภาษาจีน
  - ภาษาญี่ปุ่น

**Content ขวา — บทความทั้งหมด:**
- Heading: "บทความทั้งหมด"
- **Layout:** Grid 3 คอลัมน์
- **Card Style:**
  - รูป featured image (~280x180px, border-radius ~8px)
  - **Category badge** มุมซ้ายบน: "ข่าวสารอัปเดต" / "Uncategorized" — พื้นน้ำเงิน, ตัวอักษรขาว, border-radius pill
  - **Logo "Best"** มุมซ้ายบนของรูป (watermark)
  - หัวข้อบทความ — ตัวหนา, สีน้ำเงินเข้ม, 2-3 บรรทัด
  - Excerpt — สีเทา, 2-3 บรรทัด
  - "อ่านเพิ่มเติม >" — link สีน้ำเงิน #046bd2
- **Grid:** 3 คอลัมน์ x 4 แถว = 12 บทความต่อหน้า

**Pagination:**
- อยู่ขวาล่าง
- รูปแบบ: "ก่อนหน้า 1 2 3 4 5 6 7 ถัดไป"
- ตัวเลขเป็น link, หน้าปัจจุบันเป็น bold/highlight

**Total Blog Posts:** 78 articles (7+ หน้า)

---

## 9. Blog Post Template

**URL Pattern:** `https://besttutorthailand.com/[slug]/`
**Note:** Blog posts do NOT use `/blog/` prefix in URL - they are at the root level

### Template Structure:

**Section 9.1: Breadcrumbs**
- Trail navigation with ">>" separators
- Structure: Home >> Category >> Post Title

**Section 9.2: Post Header**
- Featured image (16:9 aspect ratio, with box shadow)
- Post title (H1)
- Metadata: date, author, category

**Section 9.3: Post Content**
- Block editor content (Gutenberg)
- Heading hierarchy (H2-H6)
- Paragraphs, lists (ol/ul with 20px left padding)
- Inline images with shadow effects
- Buttons/CTAs within content

**Section 9.4: Sidebar (#secondary)**
- Widget areas:
  - Search
  - Categories with post counts
  - Recent posts

**Section 9.5: Related Posts**
- Container: "ast-single-related-posts-container"
- Shows related articles

**Section 9.6: Comments**
- Full comment system
- Comment form (textarea + author fields)
- Threaded replies (2em left margin nesting)
- Moderation awaiting status
- Edit/delete capabilities

---

## 10. Join With Us Page

**URL:** `https://besttutorthailand.com/join-with-us/`
**Meta Title:** "สมัครเป็นติวเตอร์ - Best Tutor Thailand"

### Section 10.1: Hero Section

**Background:** Light gradient
**Layout:** Centered text
**Heading:** "สอนพิเศษตัวต่อตัว สอนออนไลน์" (One-on-one and online tutoring)
**Subheading:** "สมัครเป็นติวเตอร์" (Register as a tutor)
**CTA Button:** "ลงทะเบียนสมัครเป็นติวเตอร์" (Register as Tutor)
- Links to: `/tutor-register/`

### Section 10.2: Value Proposition (4 Benefits)

**Background:** White
**Layout:** 4-column grid with icon cards

| # | Icon | Title | Description |
|---|---|---|---|
| 1 | Briefcase/money | โอกาสสร้างรายได้ จากความเชี่ยวชาญ | Choose subjects matching expertise, fair compensation based on experience |
| 2 | Support | การสนับสนุนและระบบที่ครบครัน | Scheduling, student matching, progress tracking, professional team |
| 3 | Profile | สร้างโปรไฟล์การสอนที่โดดเด่น | Create distinctive profile to attract quality students |
| 4 | Clock | ความยืดหยุ่นและอิสระในการทำงาน | Flexible days, times, locations; work-life balance |

**CTA Button:** "ลงทะเบียนสมัครเป็นติวเตอร์" (Register)

### Section 10.3: Visual Image

**Image:** Large tutoring session photo (tutor-1024x683.jpg)

### Section 10.4: Requirements Section

**Heading:** "สิ่งที่คุณต้องเตรียมในการสมัคร" (What to Prepare)
**Layout:** Two-column with image

**Requirement 1: เตรียมสื่อการสอนและความพร้อม**
- Equipment, teaching materials, computer, camera, tablet, internet, transportation

**Requirement 2: ความรับผิดชอบ และทัศนคติเชิงบวก**
- Flexibility, attentiveness, adaptability to student needs

### Section 10.5: Statistics Section

**Layout:** 4-column number display

| Statistic | Value |
|---|---|
| นักเรียนที่ลงทะเบียน | 30,000+ |
| ติวเตอร์ | [number]+ |
| องค์กรที่ไว้วางใจ | 0+ |
| วันทีมงานดูแล | 0 วัน |

### Section 10.6: FAQ Section

**Layout:** Accordion (expandable Q&A)

**Q1:** "ติวเตอร์ขอเบิกค่าสอนล่วงหน้าได้หรือไม่?" (Can tutors request advance payment?)
**A1:** Withdrawal after 5 teaching hours; processed Mon/Fri at 22:00; daily calculation at 19:00; holidays defer

**Q2:** "ติวเตอร์เลือกรับงานเฉพาะประเภทได้หรือไม่?" (Can tutors select specific job types?)
**A2:** [Content truncated]

---

## 11. Tutor Register Page

**URL:** `https://besttutorthailand.com/tutor-register/`
**Meta Title:** "ลงทะเบียนสมัครติวเตอร์ - Best Tutor Thailand"

### Complete Registration Form

**Form Platform:** WPForms

#### Group 1: Personal Information

| Field | Label | Type | Required | Options/Notes |
|---|---|---|---|---|
| first_name | ชื่อจริง | Text | Yes | |
| last_name | นามสกุล | Text | Yes | |
| nickname | ชื่อเล่น | Text | Yes | |
| gender | เพศ | Radio | Yes | ชาย (Male), หญิง (Female), LGBTQ+ |

#### Group 2: Contact Details

| Field | Label | Type | Required |
|---|---|---|---|
| email | อีเมล | Email | Yes |
| phone | เบอร์ติดต่อ | Text | Yes |
| line_social | Line ID และ Social Media อื่นๆ | Text | Yes |

#### Group 3: Background

| Field | Label | Type | Required |
|---|---|---|---|
| occupation | อาชีพปัจจุบัน | Text | Yes |
| education | ประวัติการศึกษา | Text | Yes |
| portfolio | ผลงาน | Text | Yes |

#### Group 4: Resume Upload

| Field | Label | Type | Required | Notes |
|---|---|---|---|---|
| resume | อัปโหลด Resume | File Upload | No | "(ถ้ามี)" - single file, drag-and-drop |

#### Group 5: Teaching Experience

| Field | Label | Type | Required | Options |
|---|---|---|---|---|
| experience | ประสบการณ์สอน | Dropdown | Yes | 1-10 ปี, มากกว่า 10 ปี |

#### Group 6: Teaching Style

| Field | Label | Type | Required |
|---|---|---|---|
| teaching_style | สไตล์การสอน | Selection | Yes |

#### Group 7: Visual Documentation (File Uploads)

| Field | Label | Type | Required | Max Files |
|---|---|---|---|---|
| profile_photo | รูปทำโปรไฟล์ | File Upload | Yes | 5 files |
| id_documents | รูปถ่าย/สำเนาบัตรประชาชน | File Upload | Yes | 5 files |
| review_photos | รูปรีวิวจากผู้เรียน | File Upload | No | 5 files |
| credentials | วุฒิการศึกษา | File Upload | Yes | 5 files |

#### Group 8: Teaching Details

| Field | Label | Type | Required |
|---|---|---|---|
| subjects | วิชาที่คุณรับสอน | Selection | Yes |
| rate | เรทราคาที่รับ | Text | Yes |
| address | ที่อยู่ปัจจุบัน/ที่สะดวกรับสอน | Text | Yes |

#### Group 9: Transportation

| Field | Label | Type | Required | Options |
|---|---|---|---|---|
| vehicle | มีรถส่วนตัว... | Radio | Yes | มีรถส่วนตัว (Private car), รถสาธารณะ (Public transport), อื่นๆ (Other) |

#### Group 10: Job Type Preference

| Field | Label | Type | Required | Options |
|---|---|---|---|---|
| commission_type | ท่านสะดวกรับงาน... | Radio | Yes | แบบไม่มีค่าแนะนำ (No commission), แบบมีค่าแนะนำ (With commission) |

### Terms & Conditions Section

**Title:** "กฎสำหรับติวเตอร์ที่รับงาน" (Rules for Tutors)

6 rules covering:
1. Form completion required after each session for hour tracking (no-commission)
2. Minimum 5 hours before payment withdrawal
3. Blacklisting grounds: poor teaching, phone use during lessons, tardiness, abandonment, frequent cancellations
4. Mandatory notification if unable to continue
5. Penalties for falsified forms or suspicious conduct
6. Commission jobs: payment within 24 hours of confirmation

---

## 12. Review Page

**URL:** `https://besttutorthailand.com/review/`
**Meta Title:** "Review - Best Tutor Thailand"

### Section 12.1: Review Submission Form

**Form Platform:** WPForms

| Field | Label | Type | Required | Notes |
|---|---|---|---|---|
| reviewer_name | ชื่อผู้รีวิว | Text | Yes | |
| rating | ให้คะแนน | Radio (1-5) | Yes | "1 = น้อยสุด, 5 = ดีที่สุด" |
| review_text | รีวิว | Textarea | Yes | |

**Submit Button:** "Submit"

**Notable Absences:**
- No image upload capability
- No existing reviews displayed on the page
- No star rating visual widget (simple radio 1-5)
- No tutor selection field (reviews are general, not per-tutor)
- No rating breakdown/statistics

---

## 13. Complete URL Map

### Main Pages

| Page | URL |
|---|---|
| Homepage | `/` |
| All Subjects | `/tutors/` |
| Find Tutor Form | `/find-tutor/` |
| Blog Index | `/blog/` |
| Join With Us | `/join-with-us/` |
| Tutor Registration | `/tutor-register/` |
| Review | `/review/` |

### Subject Category Pages

| Category | URL |
|---|---|
| ภาษาต่างประเทศ | `/subject/foreign-language/` |
| คณิตศาสตร์ | `/subject/mathematic/` |
| วิทยาศาสตร์ | `/subject/scient/` |
| ภาษาไทย | `/subject/thai/` |
| สังคมศึกษา | `/subject/social-study/` |
| คอมพิวเตอร์ | `/subject/computer/` |
| ศิลปะ | `/subject/art/` |
| ดนตรี | `/subject/music/` |
| กีฬา | `/subject/sport/` |

### Subject Sub-Category Pages

| Subject | URL |
|---|---|
| ภาษาอังกฤษ | `/subject/foreign-language/english/` |
| ภาษาจีน | `/subject/foreign-language/chinese/` |
| ภาษาญี่ปุ่น | `/subject/foreign-language/japanese/` |
| ภาษาเกาหลี | `/subject/foreign-language/korean/` |
| ฟิสิกส์ | `/subject/scient/physics/` |
| เคมี | `/subject/scient/chemistry/` |
| ชีววิทยา | `/subject/scient/biology/` |
| วิทย์ทั่วไป | `/subject/scient/general-scient/` |
| กีต้าร์ | `/subject/music/guitar/` |
| ตีกลอง | `/subject/music/drum/` |
| เต้น | `/subject/music/dance/` |
| เปียโน | `/subject/music/piano/` |
| ว่ายน้ำ | `/subject/sport/swim/` |
| เทควันโด | `/subject/sport/taekwondo/` |
| แบดมินตัน | `/subject/sport/badminton/` |
| โยคะ | `/subject/sport/yoga/` |

### Blog Category Pages

| Category | URL |
|---|---|
| All | `/blog/` |
| ภาษาไทย | `/blog/thai/` |
| สังคมศึกษา | `/blog/social-study/` |
| คณิตศาสตร์ | `/blog/mathematic/` |
| วิทยาศาสตร์ | `/blog/scient/` |
| ภาษาอังกฤษ | `/blog/english/` |
| ภาษาจีน | `/blog/chinese/` |
| ภาษาญี่ปุ่น | `/blog/japanese/` |

### Tutor Profiles

- Pattern: `/tutor/[nickname-fullname]/` (URL-encoded Thai)
- Total: 500+ profiles
- Example: `/tutor/ตอง-ชวิมน/`

### Blog Posts

- Pattern: `/[slug]/` (at root level, NOT under /blog/)
- Total: 78 articles
- Example: `/online-vs-home-tutoring-which-is-better/`
- Mix of English and Thai slugs (URL-encoded)

---

## 14. Subject Taxonomy (Full Data)

### Parent Categories (top-level)

| ID | Name (TH) | Slug | Tutor Count |
|---|---|---|---|
| 38 | ภาษาต่างประเทศ | tutor-foreign-language | 284 |
| 32 | คณิตศาสตร์ | tutor-mathematic | 251 |
| 36 | วิทยาศาสตร์ | tutor-scient | 182 |
| 35 | ภาษาไทย | tutor-thai | 121 |
| 37 | สังคมศึกษา | tutor-social-study | 28 |
| 55 | ดนตรี | tutor-music | 14 |
| 54 | ศิลปะ | tutor-art | 12 |
| 51 | คอมพิวเตอร์ | tutor-computer | 7 |
| 56 | กีฬา | tutor-sport | 7 |

### Sub-Categories (with parent)

| ID | Name (TH) | Slug | Tutor Count | Parent ID |
|---|---|---|---|---|
| 71 | ภาษาอังกฤษ | tutor-english | 238 | 38 |
| 70 | ภาษาจีน | tutor-chinese | 53 | 38 |
| 69 | ภาษาญี่ปุ่น | tutor-japanese | 22 | 38 |
| 39 | ภาษาเกาหลี | tutor-korean | 7 | 38 |
| 43 | คณิตศาสตร์ทั่วไป | tutor-general-mathematics | 250 | 32 |
| 40 | แคลคูลัส | tutor-calculus | 57 | 32 |
| 41 | บัญชี | tutor-account | 15 | 32 |
| 42 | สถิติ | tutor-statistics | 4 | 32 |
| 47 | วิทยาศาสตร์ทั่วไป | tutor-general-science | 145 | 36 |
| 44 | ฟิสิกส์ | tutor-physics | 71 | 36 |
| 46 | ชีววิทยา | tutor-biology | 72 | 36 |
| 45 | เคมี | tutor-chemical | 66 | 36 |
| 48 | กฎหมาย | tutor-law | 5 | 37 |
| 49 | ประวัติศาสตร์ | tutor-history | 3 | 37 |
| 50 | เศรษฐศาสตร์ | tutor-economics | 3 | 37 |
| 57 | การวาดภาพ | tutor-drawing | 12 | 54 |
| 58 | ออกแบบกราฟิก | tutor-graphic-design | 2 | 54 |
| 52 | คอมพิวเตอร์เบื้องต้น | tutor-basic-computer | 3 | 51 |
| 53 | เขียนโปรแกรม | tutor-programming | 5 | 51 |
| 59 | กีต้าร์ | tutor-guitar | 5 | 55 |
| 60 | ตีกลอง | tutor-drumming | 0 | 55 |
| 61 | เต้น | tutor-dance | 0 | 55 |
| 62 | เปียโน | tutor-piano | 8 | 55 |
| 63 | ว่ายน้ำ | tutor-swim | 4 | 56 |
| 64 | เทควันโด | tutor-taekwondo | 0 | 56 |
| 65 | แบดมินตัน | tutor-badminton | 0 | 56 |
| 66 | โยคะ | tutor-yoga | 3 | 56 |

### Popular Tutors Taxonomy

| ID | Name | Slug | Count |
|---|---|---|---|
| 72 | ติวเตอร์ที่ได้รับความนิยม | popular-tutors | 12 |

---

## 15. Tutor Data Summary

### Total Counts
- **Total tutor profiles:** 500+ (from sitemap)
- **Popular tutors (featured):** 12
- **Total blog posts:** 78

### Tutor Profile Fields (from API + pages)
- **Title:** Nickname + Full Name (Thai)
- **Slug:** URL-encoded Thai name
- **Custom Post Type:** `tutor`
- **Taxonomy:** `subject_tutor` (subjects taught, multi-select)
- **Taxonomy:** `popular_tutors` (boolean/tag for featured)
- **Content:** Built with Elementor (not standard WP content field)

### Profile Information Displayed (from page scraping)
- Nickname + Full Name
- Profile photo
- Education: degree, university, faculty/major, honors
- Certifications (e.g., HSK5, IELTS score)
- Teaching experience (years)
- Schools/institutions taught at
- Grade levels
- Work samples section
- Contact: central phone (099-189-5222) + LINE (@besttutor)

### Profile Information NOT Displayed Publicly
- Pricing/rates
- Personal email/phone
- Address/location
- Vehicle type
- Individual reviews/ratings
- Teaching style description

---

## Design System Reference

### Colors
| Role | Color | Hex |
|---|---|---|
| Primary | Blue | #046bd2 |
| Primary Hover | Dark Blue | #045cb4 |
| Accent | Light Blue | #0693e3 |
| Heading Text | Dark Slate | #1e293b |
| Body Text | Gray | #334155 |
| Background | White | #FFFFFF |
| Light BG | Blue-tinted White | #F0F5FA |
| Border | Light Gray | #D1D5DB |
| Footer Border | Very Light Gray | #eaeaea |

### Typography
- Font: System stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Base size: 16px (1rem)
- Line height: 1.65
- Headings: font-weight 600
- Body: font-weight 400

### Responsive Breakpoints
| Name | Width |
|---|---|
| Desktop | 922px+ |
| Tablet | 545px - 921px |
| Mobile | Below 544px |

### Responsive Font Sizes
| Heading | Desktop | Tablet/Mobile |
|---|---|---|
| H1 | 36px | 30px |
| H2 | 30px | 25px |
| H3 | 24px | 20px |

### Layout
- Max content width: 1200px
- Container padding: 2.5em
- Border radius: 4px (buttons), 6px (cards)
- Box shadow: 0px 1px 2px rgba(0,0,0,0.05)

### Buttons
- Border radius: 4px
- Padding: 15px 30px (desktop), 14px 28px (tablet), 12px 24px (mobile)
- Font weight: 500
- Line height: 1em
- Primary: #046bd2 bg, white text
- Hover: #045cb4 bg

### Form Fields
- Height: 40px
- Padding: 12-16px
- Border radius: 4px
- Focus: dotted outline

---

## Technical Notes

- **CMS:** WordPress
- **Theme:** Astra
- **Page Builder:** Elementor
- **Forms:** WPForms
- **Analytics:** Google Tag Manager (GTM-N8M4SNC8, GTM-NKC6BVJQ)
- **Custom Post Type:** `tutor` (for tutor profiles)
- **Custom Taxonomies:** `subject_tutor`, `popular_tutors`, `site-review-category`
- **Blog post URLs:** Root-level (not under /blog/ prefix) - important for SEO migration
- **Image lazy loading:** WordPress native
- **Accessibility:** Skip-to-content link, focus indicators, proper heading hierarchy
