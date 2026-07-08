"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";
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
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const states = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

export function RegisterForm() {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [constituency, setConstituency] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error(t("auth.fillRequiredFields"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("auth.passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordsDoNotMatch"));
      return;
    }
    if (!agreed) {
      toast.error(t("auth.agreeToTermsError"));
      return;
    }

    setLoading(true);

    try {
      const { needsEmailConfirmation } = await signup({
        email,
        password,
        full_name: name,
        phone,
        constituency,
      });

      if (needsEmailConfirmation) {
        toast.success(t("auth.checkEmailConfirmation"));
      } else {
        toast.success(t("auth.accountCreated"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.signupError"));
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = [
    { label: "Min 6 characters", met: password.length >= 6 },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Heading */}
      <motion.div variants={item} className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2.5 text-sm text-gray-500">
          Join India&apos;s AI-powered Constituency Development Platform.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        variants={item}
        className="rounded-[28px] border border-gray-100 bg-white p-7 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]"
      >
        <form onSubmit={handleSubmit} className="space-y-4.5">
          {/* Full Name */}
          <motion.div variants={item} className="space-y-2">
            <label htmlFor="reg-name" className="text-sm font-medium text-gray-700">
              {t("auth.fullName")}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="reg-name"
                placeholder={t("auth.namePlaceholder")}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-label={t("auth.fullName")}
              />
            </div>
          </motion.div>

          {/* Email + Phone */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-label={t("auth.email")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-phone" className="text-sm font-medium text-gray-700">
                {t("auth.phone")}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder={t("auth.phonePlaceholder")}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label={t("auth.phone")}
                />
              </div>
            </div>
          </motion.div>

          {/* Password + Confirm */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.passwordMinPlaceholder")}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 pr-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-confirm" className="text-sm font-medium text-gray-700">
                {t("auth.confirmPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.passwordReenterPlaceholder")}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 pr-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-label={t("auth.confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Password strength indicators */}
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-4 text-xs"
            >
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`size-3.5 ${check.met ? "text-green-500" : "text-gray-300"}`}
                  />
                  <span className={check.met ? "text-green-600" : "text-gray-400"}>
                    {check.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Constituency + State */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="reg-constituency" className="text-sm font-medium text-gray-700">
                {t("auth.constituency")}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="reg-constituency"
                  placeholder={t("auth.constituencyPlaceholder")}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  aria-label={t("auth.constituency")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-state" className="text-sm font-medium text-gray-700">
                {t("auth.state")}
              </label>
              <select
                id="reg-state"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 text-sm text-gray-700 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label={t("auth.state")}
              >
                <option value="">{t("auth.selectState")}</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Terms checkbox */}
          <motion.div variants={item}>
            <label className="flex items-start gap-3 text-sm text-gray-500">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 rounded border-gray-300 accent-blue-600"
                aria-label="I agree to the Terms of Service and Privacy Policy"
              />
              <span className="leading-relaxed">
                {t("auth.agreeToTerms")}{" "}
                <Link href="/register" className="font-medium text-blue-600 hover:underline">
                  {t("auth.termsOfService")}
                </Link>{" "}
                {t("auth.and")}{" "}
                <Link href="/register" className="font-medium text-blue-600 hover:underline">
                  {t("auth.privacyPolicy")}
                </Link>
              </span>
            </label>
          </motion.div>

          {/* Submit */}
          <motion.div variants={item}>
            <Button
              type="submit"
              disabled={loading || !name || !email || !password || !confirmPassword}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {t("auth.creatingAccount")}
                </span>
              ) : (
                t("auth.createAccount")
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.p variants={item} className="mt-6 text-center text-sm text-gray-500">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          {t("auth.signIn")}
        </Link>
      </motion.p>
    </motion.div>
  );
}
