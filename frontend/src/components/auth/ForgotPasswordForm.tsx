"use client";

import { useState } from "react";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";

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
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {t("auth.checkYourEmail")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("auth.resetLinkSent")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.backToLogin")}
          </Link>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          {t("auth.forgotPassword")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("auth.forgotPasswordSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              className="h-12 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email}
          className="h-12 w-full bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
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
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3" />
          {t("auth.backToLogin")}
        </Link>
      </p>
    </motion.div>
  );
}
