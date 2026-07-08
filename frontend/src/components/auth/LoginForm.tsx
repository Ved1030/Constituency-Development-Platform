"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, Landmark } from "lucide-react";
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

export function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t("auth.fillRequiredFields"));
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success(t("auth.signedInSuccessfully"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("auth.invalidCredentials"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Top illustration */}
      <motion.div variants={item} className="mb-6 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Landmark className="size-7 text-white" />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div variants={item} className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome Back <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">&#x1F44B;</span>
        </h2>
        <p className="mt-2.5 text-sm text-gray-500">
          Sign in to access your constituency dashboard.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        variants={item}
        className="rounded-[28px] border border-gray-100 bg-white p-7 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <motion.div variants={item} className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
              {t("auth.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="login-email"
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

          {/* Password */}
          <motion.div variants={item} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                {t("auth.password")}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 pr-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-label={t("auth.password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div variants={item}>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {t("auth.signingIn")}
                </span>
              ) : (
                t("auth.signIn")
              )}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div variants={item} className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {t("common.orContinueWith")}
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </motion.div>

        {/* Social auth buttons */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          {[
            {
              name: "Google",
              icon: (
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              ),
            },
            {
              name: "Microsoft",
              icon: (
                <svg className="size-5" viewBox="0 0 24 24">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                </svg>
              ),
            },
            {
              name: "Apple",
              icon: (
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              ),
            },
          ].map((provider) => (
            <button
              key={provider.name}
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
              aria-label={`Continue with ${provider.name}`}
            >
              {provider.icon}
              <span className="hidden sm:inline">{provider.name}</span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p variants={item} className="mt-8 text-center text-sm text-gray-500">
        {t("auth.dontHaveAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          {t("auth.createAccount")}
        </Link>
      </motion.p>
    </motion.div>
  );
}
