"use client";

import Link from "next/link";
import { Code2, MessageCircle, Briefcase, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { href: "/", label: t("nav.features") },
    { href: "/", label: t("nav.howItWorks") },
    { href: "/", label: t("nav.solutions") },
    { href: "/login", label: t("nav.pricing") },
    { href: "/login", label: t("nav.faq") },
  ];

  const resources = [
    { href: "/login", label: t("nav.documentation") },
    { href: "/login", label: t("nav.apiReference") },
    { href: "/login", label: t("nav.blog") },
    { href: "/login", label: t("nav.community") },
    { href: "/login", label: t("nav.support") },
  ];

  const contactItems = [
    { icon: Mail, text: "hello@cdp.gov.in" },
    { icon: Phone, text: "+91 1800-123-4567" },
    { icon: MapPin, text: "New Delhi, India" },
  ];

  const socialLinks = [
    { icon: Code2, href: "https://github.com", label: "GitHub" },
    { icon: MessageCircle, href: "https://twitter.com", label: "Twitter" },
    { icon: Briefcase, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                CD
              </div>
              <span className="text-lg font-bold text-foreground">CDP</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("nav.quickLinks")}
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("nav.resources")}
            </h3>
            <ul className="mt-4 space-y-3">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <Link
                    href={resource.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("nav.contactUs")}
            </h3>
            <ul className="mt-4 space-y-4">
              {contactItems.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <item.icon className="size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Constituency Development Platform.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {t("nav.privacyPolicy")}
            </Link>
            <Link
              href="/login"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {t("nav.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
