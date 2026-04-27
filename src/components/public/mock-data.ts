// Mock / seed data used by public pages while Backend API routes come online.
// Replace with real API calls in Phase 4+. All Thai copy mirrors the old site
// content documented in docs/site-structure-crawl.md.
//
// Shapes here intentionally stay a strict SUBSET of eventual Prisma rows so
// components don't need to change later.

export interface MockSubject {
  slug: string;
  name: string;
  /** lucide-react icon name — resolved inside SubjectCard */
  iconName:
    | "Languages"
    | "Calculator"
    | "Microscope"
    | "BookOpen"
    | "Globe2"
    | "Monitor"
    | "Palette"
    | "Music"
    | "Dumbbell"
    | "Sparkles";
  tutorCount: number;
  /** Short marketing blurb shown under the name */
  tagline?: string;
}

export const MOCK_POPULAR_SUBJECTS: MockSubject[] = [
  { slug: "thai", name: "ภาษาไทย", iconName: "BookOpen", tutorCount: 35, tagline: "อ่าน · เขียน · สอบเข้า" },
  { slug: "social", name: "สังคมศึกษา", iconName: "Globe2", tutorCount: 28, tagline: "ประวัติศาสตร์ · เศรษฐศาสตร์" },
  { slug: "math", name: "คณิตศาสตร์", iconName: "Calculator", tutorCount: 96, tagline: "ม.ต้น · ม.ปลาย · มหาวิทยาลัย" },
  { slug: "science", name: "วิทยาศาสตร์", iconName: "Microscope", tutorCount: 74, tagline: "ฟิสิกส์ · เคมี · ชีววิทยา" },
  { slug: "language", name: "ภาษาต่างประเทศ", iconName: "Languages", tutorCount: 186, tagline: "อังกฤษ · จีน · ญี่ปุ่น · เกาหลี" },
];

export const MOCK_ALL_CATEGORIES: MockSubject[] = [
  { slug: "english", name: "ภาษาต่างประเทศ", iconName: "Languages", tutorCount: 186, tagline: "อังกฤษ · จีน · ญี่ปุ่น · เกาหลี" },
  { slug: "math", name: "คณิตศาสตร์", iconName: "Calculator", tutorCount: 96, tagline: "ม.ต้น · ม.ปลาย · มหาวิทยาลัย" },
  { slug: "science", name: "วิทยาศาสตร์", iconName: "Microscope", tutorCount: 74, tagline: "ฟิสิกส์ · เคมี · ชีววิทยา" },
  { slug: "thai", name: "ภาษาไทย", iconName: "BookOpen", tutorCount: 35, tagline: "อ่าน · เขียน · สอบเข้า" },
  { slug: "social", name: "สังคมศึกษา", iconName: "Globe2", tutorCount: 28, tagline: "ประวัติศาสตร์ · เศรษฐศาสตร์ · กฎหมาย" },
  { slug: "computer", name: "คอมพิวเตอร์", iconName: "Monitor", tutorCount: 22, tagline: "Coding · พื้นฐานคอม" },
  { slug: "art", name: "ศิลปะ", iconName: "Palette", tutorCount: 18, tagline: "วาดรูป · กราฟิกดีไซน์" },
  { slug: "music", name: "ดนตรี", iconName: "Music", tutorCount: 24, tagline: "กีตาร์ · กลอง · เปียโน · เต้น" },
  { slug: "sport", name: "กีฬา", iconName: "Dumbbell", tutorCount: 16, tagline: "ว่ายน้ำ · เทควันโด · แบดมินตัน · โยคะ" },
];

// ---- Tutors -----------------------------------------------------------------

export interface MockTutor {
  slug: string;
  nickname: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  rating: number;
  reviewCount: number;
  ratePricing: number;
  subjects: string[];
  province: string | null;
  education: string;
  isPopular: boolean;
}

/** Placeholder photo — null means TutorCard renders a gradient avatar with
 * initials instead of fetching remote images (keeps build deterministic
 * before Cloudinary media is seeded). */
const PLACEHOLDER_AVATAR = (): string | null => null;

export const MOCK_FEATURED_TUTORS: MockTutor[] = [
  {
    slug: "kru-wawa-panisa",
    nickname: "ครูวาวา",
    firstName: "ปณิศา",
    lastName: "เจริญสุข",
    profileImageUrl: PLACEHOLDER_AVATAR(),
    rating: 4.9,
    reviewCount: 36,
    ratePricing: 550,
    subjects: ["ภาษาอังกฤษ", "IELTS", "TOEIC"],
    province: "กรุงเทพมหานคร",
    education: "จุฬาฯ คณะอักษรศาสตร์",
    isPopular: true,
  },
  {
    slug: "kru-mika-ratchanee",
    nickname: "ครูมิกะ",
    firstName: "รัชนี",
    lastName: "ชัยสงคราม",
    profileImageUrl: PLACEHOLDER_AVATAR(),
    rating: 4.8,
    reviewCount: 28,
    ratePricing: 500,
    subjects: ["ภาษาจีน", "HSK"],
    province: "กรุงเทพมหานคร",
    education: "ม.ปักกิ่ง ภาษาศาสตร์",
    isPopular: true,
  },
  {
    slug: "kru-view-thanakrit",
    nickname: "ครูวิว",
    firstName: "ธนกฤต",
    lastName: "พงษ์วานิช",
    profileImageUrl: PLACEHOLDER_AVATAR(),
    rating: 4.9,
    reviewCount: 42,
    ratePricing: 600,
    subjects: ["คณิตศาสตร์", "ฟิสิกส์"],
    province: "นนทบุรี",
    education: "จุฬาฯ คณะวิศวกรรมศาสตร์",
    isPopular: false,
  },
  {
    slug: "kru-jam-supanida",
    nickname: "ครูแจม",
    firstName: "สุพาณิดา",
    lastName: "เจริญสุข",
    profileImageUrl: PLACEHOLDER_AVATAR(),
    rating: 4.7,
    reviewCount: 19,
    ratePricing: 450,
    subjects: ["ชีววิทยา", "เคมี"],
    province: "กรุงเทพมหานคร",
    education: "มหิดล คณะแพทยศาสตร์",
    isPopular: false,
  },
  {
    slug: "kru-alice-chavalya",
    nickname: "ครูอลิซ",
    firstName: "ชวัลญา",
    lastName: "รัตนวงศ์",
    profileImageUrl: PLACEHOLDER_AVATAR(),
    rating: 5.0,
    reviewCount: 22,
    ratePricing: 650,
    subjects: ["ภาษาอังกฤษ", "SAT"],
    province: "กรุงเทพมหานคร",
    education: "ธรรมศาสตร์ คณะศิลปศาสตร์",
    isPopular: true,
  },
  {
    slug: "kru-ney-kanyarat",
    nickname: "ครูเนย",
    firstName: "กัญญรัตน์",
    lastName: "สุขสบาย",
    profileImageUrl: PLACEHOLDER_AVATAR(),
    rating: 4.8,
    reviewCount: 31,
    ratePricing: 500,
    subjects: ["ภาษาไทย", "สังคมศึกษา"],
    province: "กรุงเทพมหานคร",
    education: "จุฬาฯ คณะอักษรศาสตร์",
    isPopular: false,
  },
];

// ---- Courses ----------------------------------------------------------------

export interface MockCourse {
  slug: string;
  title: string;
  description: string;
  durationHours: number;
  imageAlt: string;
  accentColor: string;
}

export const MOCK_FEATURED_COURSES: MockCourse[] = [
  {
    slug: "chinese-for-kids",
    title: "คอร์สภาษาจีน พูดเก่งตั้งแต่เด็ก",
    description: "สอนสด ใช้ภาษาจีนตลอดชั่วโมง ฝึกฟัง-พูดให้คล่อง เรียนสนุกผ่านเกม",
    durationHours: 30,
    imageAlt: "คอร์สภาษาจีนสำหรับเด็ก",
    accentColor: "#fef3c7",
  },
  {
    slug: "business-chinese",
    title: "คอร์สภาษาจีน สำหรับวัยทำงาน",
    description: "ใช้ภาษาจีนได้จริง ฝึกโต้ตอบผ่านสถานการณ์จำลอง ด้วยบทสนทนาเชิงธุรกิจ",
    durationHours: 30,
    imageAlt: "คอร์สภาษาจีนสำหรับวัยทำงาน",
    accentColor: "#dbeafe",
  },
  {
    slug: "ielts-prep",
    title: "คอร์สติวสอบ IELTS",
    description: "ติวครบทุกพาร์ต Listening, Reading, Writing, Speaking ฝึกทำข้อสอบจริง",
    durationHours: 30,
    imageAlt: "คอร์สติวสอบ IELTS",
    accentColor: "#fce7f3",
  },
  {
    slug: "math-entrance",
    title: "คอร์สคณิตศาสตร์ เพิ่มเกรด-สอบเข้า",
    description: "ปูพื้นฐานสู่ความเป็นเลิศ เทคนิคคิดเลขเร็ว พร้อมวิธีลัดแก้โจทย์ไว",
    durationHours: 30,
    imageAlt: "คอร์สคณิตศาสตร์สอบเข้ามหาวิทยาลัย",
    accentColor: "#dcfce7",
  },
];

// ---- Articles --------------------------------------------------------------

export interface MockArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTimeMinutes: number;
  imageAlt: string;
  accentColor: string;
}

export const MOCK_FEATURED_ARTICLES: MockArticle[] = [
  {
    slug: "ha-tutor-phasa-angkrit-tua-tor-tua-krungthep",
    title: "หาติวเตอร์ภาษาอังกฤษตัวต่อตัวในกรุงเทพ ต้องดูอะไรบ้าง?",
    excerpt:
      "คู่มือฉบับสมบูรณ์สำหรับการเลือกติวเตอร์ภาษาอังกฤษในกรุงเทพฯ พร้อมเช็กลิสต์ 7 ข้อที่ต้องรู้ก่อนเริ่มเรียน",
    category: "ภาษาอังกฤษ",
    publishedAt: "2026-04-10",
    readTimeMinutes: 6,
    imageAlt: "หาติวเตอร์ภาษาอังกฤษ",
    accentColor: "#dbeafe",
  },
  {
    slug: "5-witi-lueak-tutor-tua-tor-tua",
    title: "5 วิธีเลือกติวเตอร์ตัวต่อตัวให้ตรงกับลูก",
    excerpt:
      "แนะนำเทคนิคเลือกติวเตอร์ที่เหมาะสมกับสไตล์การเรียนของลูก เพื่อให้ได้ผลลัพธ์สูงสุด",
    category: "คู่มือผู้ปกครอง",
    publishedAt: "2026-04-02",
    readTimeMinutes: 4,
    imageAlt: "5 วิธีเลือกติวเตอร์",
    accentColor: "#fce7f3",
  },
  {
    slug: "rian-phiset-online-vs-tam-ban",
    title: "เรียนพิเศษออนไลน์ vs ที่บ้าน แบบไหนดีกว่ากัน?",
    excerpt:
      "เปรียบเทียบข้อดี-ข้อเสียของการเรียนพิเศษออนไลน์และที่บ้าน พร้อมคำแนะนำเลือกให้เหมาะ",
    category: "เทคนิคการเรียน",
    publishedAt: "2026-03-28",
    readTimeMinutes: 5,
    imageAlt: "เรียนพิเศษออนไลน์กับที่บ้าน",
    accentColor: "#dcfce7",
  },
  {
    slug: "tgat-tpat-a-level-khue-arai",
    title: "TGAT / TPAT / A-Level คืออะไร? สรุปครบสำหรับ DEK68",
    excerpt:
      "สรุประบบสอบเข้ามหาวิทยาลัยแบบใหม่ พร้อมแนวทางเตรียมตัวสำหรับน้อง ๆ ม.ปลาย",
    category: "แนะแนวการสอบ",
    publishedAt: "2026-03-20",
    readTimeMinutes: 7,
    imageAlt: "TGAT TPAT A-Level คืออะไร",
    accentColor: "#fef3c7",
  },
];

// ---- Testimonials ---------------------------------------------------------

export interface MockTestimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

export const MOCK_TESTIMONIALS: MockTestimonial[] = [
  {
    id: "t1",
    name: "คุณแม่สมศรี",
    role: "ผู้ปกครองน้องฟิวส์ (ม.4)",
    rating: 5,
    quote:
      "ลูกเรียนกับครูต้นอ้อ 3 เดือน เกรดคณิตขึ้นจาก C เป็น A พอใจมาก ครูใจเย็น อธิบายเข้าใจง่าย",
  },
  {
    id: "t2",
    name: "น้องมินนี่",
    role: "นักเรียน ม.6 สอบ IELTS",
    rating: 5,
    quote:
      "ครูวาวาช่วยติว IELTS ให้จนได้ 7.0 จากเดิม 5.5 ใน 4 เดือน ขอบคุณ Best Tutor ที่แนะนำครูเก่ง ๆ ให้ค่ะ",
  },
  {
    id: "t3",
    name: "คุณพ่อวรวิทย์",
    role: "ผู้ปกครองน้องเมษา (ป.5)",
    rating: 5,
    quote:
      "สะดวกมาก จับคู่ครูไวภายในวันเดียว ครูมาสอนถึงบ้าน ลูกชอบมาก เรียนภาษาจีนสนุกขึ้นเยอะ",
  },
];

// ---- FAQ -------------------------------------------------------------------

export interface MockFaqItem {
  question: string;
  answer: string;
}

export const MOCK_FAQ_ITEMS: MockFaqItem[] = [
  {
    question: "เรียนพิเศษกับติวเตอร์ที่ Best Tutor ราคาเท่าไหร่?",
    answer:
      "ราคาเริ่มต้นที่ 350-800 บาท/ชั่วโมง ขึ้นอยู่กับวิชา ระดับชั้น และประสบการณ์ของติวเตอร์ โดยสามารถดูราคาที่หน้าโปรไฟล์ติวเตอร์แต่ละคนก่อนตัดสินใจ",
  },
  {
    question: "จับคู่ติวเตอร์ใช้เวลากี่วัน?",
    answer:
      "หลังจากกรอกฟอร์ม ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง และจะจัดหาติวเตอร์ที่เหมาะกับความต้องการได้ภายใน 1-3 วัน",
  },
  {
    question: "สามารถเรียนออนไลน์ได้ไหม?",
    answer:
      "ได้ครับ ติวเตอร์ของเรารองรับทั้งการเรียนตัวต่อตัวที่บ้าน และเรียนออนไลน์ผ่าน Zoom / Google Meet โดยสามารถเลือกได้ตามสะดวก",
  },
  {
    question: "หากไม่พอใจกับติวเตอร์ สามารถเปลี่ยนได้หรือไม่?",
    answer:
      "ได้ครับ หากคุณไม่พอใจกับติวเตอร์ที่จับคู่ สามารถแจ้งทีมงานเพื่อเปลี่ยนติวเตอร์ใหม่ฟรี ภายใน 1 ชั่วโมงแรกของการเรียน",
  },
];

// ---- Partners (university logos) ------------------------------------------

export const MOCK_PARTNER_LOGOS: string[] = [
  "จุฬาลงกรณ์มหาวิทยาลัย",
  "มหาวิทยาลัยธรรมศาสตร์",
  "มหาวิทยาลัยมหิดล",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "ABAC",
  "KMITL",
  "มศว",
  "SWU",
  "ม.ศิลปากร",
  "ม.ขอนแก่น",
];

// ---- Navigation links ------------------------------------------------------

export interface NavLink {
  href: string;
  label: string;
}

export const MAIN_NAV_LINKS: NavLink[] = [
  { href: "/", label: "หน้าแรก" },
  { href: "/tutors", label: "รายวิชาที่เปิดสอน" },
  { href: "/find-tutor", label: "หาครูสอนพิเศษ" },
  { href: "/blog", label: "บทความ" },
];

export const CONTACT_INFO = {
  phone: "02-000-0000",
  phoneHref: "tel:+6620000000",
  email: "contact@besttutorthailand.com",
  lineId: "@besttutor",
  lineHref: "https://lin.ee/jL50860",
  address: "กรุงเทพมหานคร ประเทศไทย",
  workDays: "จันทร์-เสาร์ 9:00-18:00 น.",
  facebook: "https://facebook.com/besttutorthailand",
  instagram: "https://instagram.com/besttutor_th",
  tiktok: "#",
} as const;
