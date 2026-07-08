"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, User, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type LoginRole = "citizen" | "mp";

export function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<LoginRole>("citizen");
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">
          {t("auth.welcomeBack")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("auth.signInSubtitle")}
        </p>
      </div>

      {/* Role selector cards */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedRole("citizen")}
          className={cn(
            "relative rounded-xl border-2 p-4 text-left transition-all duration-200",
            selectedRole === "citizen"
              ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
              : "border-border bg-card hover:border-primary/30 hover:bg-muted/30",
          )}
        >
          {selectedRole === "citizen" && (
            <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
              <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors",
            selectedRole === "citizen" ? "bg-primary text-white" : "bg-primary/10 text-primary",
          )}>
            <User className="size-5" />
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-foreground">Citizen</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
              Raise complaints, track issues, participate.
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole("mp")}
          className={cn(
            "relative rounded-xl border-2 p-4 text-left transition-all duration-200",
            selectedRole === "mp"
              ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
              : "border-border bg-card hover:border-primary/30 hover:bg-muted/30",
          )}
        >
          {selectedRole === "mp" && (
            <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
              <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors",
            selectedRole === "mp" ? "bg-primary text-white" : "bg-primary/10 text-primary",
          )}>
            <Landmark className="size-5" />
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-foreground">MP Login</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
              For Members of Parliament
            </div>
          </div>
        </button>
      </div>

      {/* MP notice */}
      {selectedRole === "mp" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-5 rounded-xl border border-amber-200/50 bg-amber-50/50 px-4 py-3"
        >
          <div className="flex items-start gap-2.5">
            <Landmark className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Login using your official MP email. Only verified MP accounts
              can access the Constituency Intelligence dashboard.
            </p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder={
                selectedRole === "mp"
                  ? "mp@gov.in"
                  : t("auth.emailPlaceholder")
              }
              className="h-12 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.password")}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.passwordPlaceholder")}
              className="h-12 pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
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
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("auth.dontHaveAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          {t("auth.createAccount")}
        </Link>
      </p>
    </motion.div>
  );
}
