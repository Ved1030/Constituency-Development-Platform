"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";

const states = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

const languages = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi"];

export function RegisterForm() {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
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
        // Auto-login handled in AuthContext — user is redirected to dashboard
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.signupError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          {t("auth.createAccount")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.fullName")}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("auth.namePlaceholder")}
              className="h-12 pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.phone")}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="tel"
                placeholder={t("auth.phonePlaceholder")}
                className="h-12 pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordMinPlaceholder")}
                className="h-12 pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.confirmPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder={t("auth.passwordReenterPlaceholder")}
                className="h-12 pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.constituency")}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("auth.constituencyPlaceholder")}
                className="h-12 pl-10"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.state")}
            </label>
            <select
              className="h-12 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">{t("auth.selectState")}</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 rounded border-border accent-primary"
          />
          <span>
            {t("auth.agreeToTerms")}{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              {t("auth.termsOfService")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              {t("auth.privacyPolicy")}
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          disabled={loading || !name || !email || !password || !confirmPassword}
          className="h-12 w-full bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
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
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          {t("auth.signIn")}
        </Link>
      </p>
    </motion.div>
  );
}
