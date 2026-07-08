"use client";

import { useState } from "react";
import { Mail, Loader2, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("auth.enterEmail"));
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("auth.forgotPasswordError"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-green-50">
            <CheckCircle2 className="size-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t("auth.checkYourEmail")}
          </h2>
          <p className="mt-2.5 text-sm text-gray-500">
            {t("auth.resetLinkSent")}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-700">{email}</p>
        </motion.div>

        <motion.div variants={item} className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="size-4" />
            {t("auth.backToLogin")}
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Top icon */}
      <motion.div variants={item} className="mb-6 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Lock className="size-7 text-white" />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div variants={item} className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {t("auth.forgotPassword")}
        </h2>
        <p className="mt-2.5 text-sm text-gray-500">
          {t("auth.forgotPasswordSubtitle")}
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        variants={item}
        className="rounded-[28px] border border-gray-100 bg-white p-7 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={item} className="space-y-2">
            <label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
              {t("auth.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="forgot-email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-label={t("auth.email")}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button
              type="submit"
              disabled={loading || !email}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {t("auth.sending")}
                </span>
              ) : (
                t("auth.sendResetLink")
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.div variants={item} className="mt-6 flex justify-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          <ArrowLeft className="size-3.5" />
          {t("auth.backToLogin")}
        </Link>
      </motion.div>
    </motion.div>
  );
}
