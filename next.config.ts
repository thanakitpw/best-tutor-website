import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "besttutorthailand.com" },
    ],
  },

  async redirects() {
    return [
      // Subject URLs: เว็บเดิม → เว็บใหม่ (ดู docs/seo-migration-audit.md)
      { source: "/subject/foreign-language/english", destination: "/subject/english", permanent: true },
      { source: "/subject/foreign-language/chinese", destination: "/subject/chinese", permanent: true },
      { source: "/subject/foreign-language/japanese", destination: "/subject/japanese", permanent: true },
      { source: "/subject/foreign-language/korean", destination: "/subject/korean", permanent: true },
      { source: "/subject/foreign-language", destination: "/tutors", permanent: true },
      { source: "/subject/mathematic", destination: "/subject/math", permanent: true },
      { source: "/subject/mathematic/:sub", destination: "/subject/math/:sub", permanent: true },
      { source: "/subject/scient", destination: "/subject/science", permanent: true },
      { source: "/subject/scient/physics", destination: "/subject/physics", permanent: true },
      { source: "/subject/scient/chemistry", destination: "/subject/chemistry", permanent: true },
      { source: "/subject/scient/biology", destination: "/subject/biology", permanent: true },
      { source: "/subject/scient/general-scient", destination: "/subject/science/general", permanent: true },
      { source: "/subject/social-study", destination: "/subject/social", permanent: true },
      { source: "/subject/social-study/:sub", destination: "/subject/social/:sub", permanent: true },

      // Blog posts: root level → /blog/[slug] (จาก audit 12 URLs)
      { source: "/tiw-sop-khao-mo-1-rongrian-dang-2026", destination: "/blog/tiw-sop-khao-mo-1-rongrian-dang", permanent: true },
      { source: "/tutor-phasa-kaouli-tua-tor-tua-2026", destination: "/blog/tutor-phasa-kaouli-tua-tor-tua", permanent: true },
      { source: "/tgat-tpat-a-level-khue-arai-2026", destination: "/blog/tgat-tpat-a-level-khue-arai", permanent: true },
      { source: "/rian-phasa-yipun-tutor-tua-tor-tua-2026", destination: "/blog/rian-phasa-yipun-tutor-tua-tor-tua", permanent: true },
      { source: "/tiw-tgat-tpat-a-level-tua-tor-tua-2026", destination: "/blog/tiw-tgat-tpat-a-level-tua-tor-tua", permanent: true },
      { source: "/5-witi-lueak-tutor-tua-tor-tua-2026", destination: "/blog/5-witi-lueak-tutor-tua-tor-tua", permanent: true },
      { source: "/rian-phiset-online-vs-tam-ban-2026", destination: "/blog/rian-phiset-online-vs-tam-ban", permanent: true },
      { source: "/khru-son-phiset-khannit-mathayom-plai-a-level-2026", destination: "/blog/khru-son-phiset-khannit-mathayom-plai-a-level", permanent: true },
      { source: "/tutor-phasa-jin-tua-tor-tua-wai-thamgan-2026", destination: "/blog/tutor-phasa-jin-tua-tor-tua-wai-thamgan", permanent: true },
      { source: "/ha-tutor-phasa-angkrit-tua-tor-tua-krungthep-2026", destination: "/blog/ha-tutor-phasa-angkrit-tua-tor-tua-krungthep", permanent: true },
      { source: "/ka-khru-son-phiset-tua-tor-tua-2026", destination: "/blog/ka-khru-son-phiset-tua-tor-tua", permanent: true },
      { source: "/dek-prathom-khuan-rian-phiset-mai-2026", destination: "/blog/dek-prathom-khuan-rian-phiset-mai", permanent: true },
    ];
  },
};

export default nextConfig;
