"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Mic,
  Star,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { helpArticles } from "@/data/mock-citizen";
import { useState } from "react";

const faqCategories = [
  {
    icon: FileText,
    title: "Getting Started",
    articles: helpArticles.filter((a) => a.category === "Getting Started"),
  },
  {
    icon: MessageCircle,
    title: "Community",
    articles: helpArticles.filter((a) => a.category === "Community"),
  },
  {
    icon: Star,
    title: "Account",
    articles: helpArticles.filter((a) => a.category === "Account"),
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/citizen/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Help & Support</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-border p-8"
      >
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <HelpCircle className="size-8 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">How can we help you?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Search our help center or browse frequently asked questions
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, label: "Call Support", description: "1800-180-1551 (Toll Free)", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Mail, label: "Email Us", description: "help@cdp.gov.in", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: MessageCircle, label: "Live Chat", description: "Chat with our support team", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((contact, i) => (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
          >
            <div className={cn("flex size-12 items-center justify-center rounded-xl", contact.bg)}>
              <contact.icon className={cn("size-6", contact.color)} />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{contact.label}</div>
              <div className="text-xs text-muted-foreground">{contact.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {faqCategories.map((category, cIdx) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: cIdx * 0.1 }}
            className="rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-border p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <category.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{category.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {category.articles.map((article) => (
                <div key={article.id}>
                  <button
                    onClick={() => setOpenFaq(openFaq === article.id ? null : article.id)}
                    className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{article.title}</span>
                      {article.popular && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Popular
                        </span>
                      )}
                    </div>
                    {openFaq === article.id ? (
                      <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-16 text-sm text-muted-foreground">
                        {article.content}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Additional Resources</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "User Guide (PDF)", icon: BookOpen },
            { label: "Video Tutorials", icon: ExternalLink },
            { label: "Voice Input Guide", icon: Mic },
            { label: "Language Support", icon: Globe },
          ].map((resource) => (
            <button
              key={resource.label}
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-left transition-all hover:bg-muted/50 hover:shadow-sm"
            >
              <resource.icon className="size-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{resource.label}</span>
              <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
