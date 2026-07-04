"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleSelector } from "./RoleSelector";

const states = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

const languages = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi"];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"citizen" | "mp" | "admin">("citizen");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the Terms of Service");
      return;
    }
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Account created successfully!");
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
        <p className="mt-2 text-muted-foreground">
          Join the platform transforming constituency development
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <RoleSelector value={role} onChange={setRole} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Enter your full name" className="h-12 pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" placeholder="you@email.com" className="h-12 pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="tel" placeholder="+91 98765 43210" className="h-12 pl-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                className="h-12 pl-10 pr-10"
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" placeholder="Re-enter password" className="h-12 pl-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Constituency</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Your constituency" className="h-12 pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">State</label>
            <select className="h-12 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select state</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Preferred Language</label>
          <select className="h-12 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 rounded border-border accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
