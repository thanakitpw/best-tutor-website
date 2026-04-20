import type { ReactNode } from "react";

import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { StickyCta } from "@/components/public/sticky-cta";

/**
 * Public layout — wraps all routes under the `(public)` route group.
 * Renders the global navbar, sticky floating CTA (LINE + phone), and footer.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
