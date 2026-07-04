"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { RoleSelector } from "./RoleSelector";

const MOCK_USERS = [
  { email: "citizen@demo.com", password: "123456", role: "citizen" as const },
  { email: "mp@demo.com", password: "123456", role: "mp" as const },
  { email: "admin@demo.com", password: "123456", role: "admin" as const },
];

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<"citizen" | "mp" | "admin">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully!");

    if (user.role === "mp" || user.role === "admin") {
      router.push("/mp/dashboard");
    } else {
      router.push("/citizen/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to access your constituency dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <RoleSelector value={role} onChange={setRole} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-12 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-12 pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            Remember me
          </label>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
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
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <SocialLoginButtons />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
