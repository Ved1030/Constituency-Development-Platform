"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Free for government organizations",
  "No credit card required",
  "Enterprise-grade security",
  "Dedicated support team",
];

export function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary via-primary to-accent px-8 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to Transform Your Constituency?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join thousands of government officials and citizens already using
              CDP to build better communities through data-driven decisions.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 gap-2 bg-white px-8 text-base font-semibold text-primary shadow-lg hover:bg-white/90 hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 gap-2 border-white/30 px-8 text-base text-white hover:bg-white/10 hover:text-white"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <CheckCircle className="size-4 text-white/60" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
