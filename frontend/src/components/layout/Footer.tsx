"use client";

import Link from "next/link";
import { Code2, MessageCircle, Briefcase, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function Footer() {
  const { t } = useTranslation();

  const platformLinks = [
    { href: "#features", label: t("nav.features") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#solutions", label: t("nav.solutions") },
    { href: "/login", label: t("nav.pricing") },
    { href: "/login", label: t("nav.faq") },
  ];

  const developerLinks = [
    { href: "/login", label: t("nav.documentation") },
    { href: "/login", label: t("nav.apiReference") },
    { href: "https://github.com", label: "GitHub" },
    { href: "/login", label: t("nav.blog") },
  ];

  const supportLinks = [
    { href: "/login", label: t("nav.support") },
    { href: "/login", label: t("nav.contactUs") },
    { href: "/login", label: t("nav.community") },
  ];

  const legalLinks = [
    { href: "/login", label: t("nav.privacyPolicy") },
    { href: "/login", label: t("nav.termsOfService") },
  ];

  const socialLinks = [
    { icon: Code2, href: "https://github.com", label: "GitHub" },
    { icon: MessageCircle, href: "https://twitter.com", label: "Twitter" },
    { icon: Briefcase, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@cdp.gov.in", label: "Email" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-lg shadow-primary/25">
                CD
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                CDP
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("landing.footerPlatform")}
            </h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
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
              {t("landing.footerDevelopers")}
            </h3>
            <ul className="mt-4 space-y-3">
              {developerLinks.map((link) => (
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
              {t("landing.footerSupport")}
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
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
              {t("landing.footerLegal")}
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
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

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-foreground">
                {t("landing.footerNewsletter")}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("landing.footerNewsletterDesc")}
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder={t("landing.footerEmailPlaceholder")}
                  className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
                <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  {t("landing.footerSubscribe")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-20">
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
