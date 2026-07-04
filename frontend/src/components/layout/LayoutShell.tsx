"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const hideNavFooterRoutes = ["/login", "/register", "/citizen", "/mp"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNavFooter = mounted && hideNavFooterRoutes.some((r) => pathname.startsWith(r));

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideNavFooter && <Footer />}
    </>
  );
}
