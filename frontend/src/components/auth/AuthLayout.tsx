"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Globe,
  BarChart3,
  MapPin,
  Users,
  Check,
} from "lucide-react";
import Link from "next/link";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

const features = [
  { icon: Brain, label: "AI Analytics" },
  { icon: Shield, label: "Secure Authentication" },
  { icon: Globe, label: "Geo Intelligence" },
  { icon: BarChart3, label: "Multilingual Support" },
  { icon: MapPin, label: "Digital Twin" },
  { icon: Users, label: "Community Driven" },
];

const stats = [
  { value: 1840000, suffix: "+", label: "Citizens Served", display: "18.4L+" },
  { value: 142, suffix: "", label: "Villages Covered", display: "142" },
  { value: 87, suffix: "%", label: "AI Prediction Accuracy", display: "87%" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — branding */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2d5c] to-[#1a1040] p-10 xl:p-14 lg:flex">
        {/* Ambient glow effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 size-[600px] rounded-full bg-indigo-500/8 blur-[140px]" />
          <div className="absolute left-1/2 top-1/4 size-[300px] -translate-x-1/2 rounded-full bg-purple-500/6 blur-[100px]" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Top — Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <span className="text-lg font-black tracking-tight text-white">CDP</span>
          </div>
          <div>
            <div className="text-lg font-bold text-white tracking-tight">
              Constituency Development Platform
            </div>
            <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-300">
              <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI Governance Platform
            </div>
          </div>
        </Link>

        {/* Center — Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-bold leading-[1.15] text-white xl:text-5xl">
            Transforming Citizen Voices into
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Data-Driven Decisions
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300/80 xl:text-lg">
            Empowering Members of Parliament with AI, real-time citizen feedback,
            geospatial intelligence, and predictive analytics.
          </p>

          {/* Feature cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.08] hover:shadow-lg hover:shadow-white/[0.02]"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 transition-colors duration-300 group-hover:bg-blue-500/20">
                  <f.icon className="size-4 text-blue-300" />
                </div>
                <span className="text-sm font-medium text-white/80">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom — Illustration + Stats */}
        <div className="relative z-10">
          {/* Vector illustration — Parliament / Smart City */}
          <div className="mb-8 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              {/* SVG Parliament/Smart City Illustration */}
              <svg
                viewBox="0 0 480 120"
                className="h-24 w-full text-white/10 xl:h-28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ground */}
                <rect x="0" y="100" width="480" height="20" rx="4" fill="currentColor" opacity="0.3" />
                {/* Parliament dome */}
                <ellipse cx="240" cy="60" rx="60" ry="40" fill="currentColor" opacity="0.5" />
                <rect x="180" y="60" width="120" height="40" fill="currentColor" opacity="0.4" />
                <rect x="190" y="40" width="100" height="20" rx="50" fill="currentColor" opacity="0.6" />
                <circle cx="240" cy="35" r="6" fill="currentColor" opacity="0.8" />
                {/* Dome finial */}
                <rect x="238" y="20" width="4" height="15" fill="currentColor" opacity="0.7" />
                {/* Pillars */}
                <rect x="195" y="65" width="6" height="35" fill="currentColor" opacity="0.6" />
                <rect x="215" y="65" width="6" height="35" fill="currentColor" opacity="0.6" />
                <rect x="259" y="65" width="6" height="35" fill="currentColor" opacity="0.6" />
                <rect x="279" y="65" width="6" height="35" fill="currentColor" opacity="0.6" />
                {/* Steps */}
                <rect x="175" y="95" width="130" height="5" rx="2" fill="currentColor" opacity="0.5" />
                <rect x="170" y="100" width="140" height="4" rx="2" fill="currentColor" opacity="0.4" />
                {/* Left buildings */}
                <rect x="40" y="70" width="30" height="30" rx="3" fill="currentColor" opacity="0.35" />
                <rect x="75" y="60" width="25" height="40" rx="3" fill="currentColor" opacity="0.3" />
                <rect x="50" y="62" width="8" height="8" rx="1" fill="currentColor" opacity="0.5" />
                <rect x="62" y="62" width="8" height="8" rx="1" fill="currentColor" opacity="0.5" />
                <rect x="80" y="65" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                <rect x="90" y="65" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                {/* Right buildings */}
                <rect x="375" y="65" width="35" height="35" rx="3" fill="currentColor" opacity="0.35" />
                <rect x="415" y="55" width="28" height="45" rx="3" fill="currentColor" opacity="0.3" />
                <rect x="385" y="70" width="7" height="7" rx="1" fill="currentColor" opacity="0.5" />
                <rect x="396" y="70" width="7" height="7" rx="1" fill="currentColor" opacity="0.5" />
                <rect x="420" y="60" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                <rect x="430" y="60" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                {/* Far left tower */}
                <rect x="10" y="50" width="20" height="50" rx="3" fill="currentColor" opacity="0.25" />
                {/* Far right tower */}
                <rect x="450" y="45" width="22" height="55" rx="3" fill="currentColor" opacity="0.25" />
                {/* Trees */}
                <circle cx="140" cy="88" r="8" fill="currentColor" opacity="0.25" />
                <circle cx="155" cy="85" r="10" fill="currentColor" opacity="0.2" />
                <circle cx="340" cy="88" r="8" fill="currentColor" opacity="0.25" />
                <circle cx="325" cy="85" r="10" fill="currentColor" opacity="0.2" />
                {/* Connection lines (data flow) */}
                <line x1="100" y1="75" x2="180" y2="75" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
                <line x1="300" y1="75" x2="380" y2="75" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
                {/* Small dots (citizens) */}
                <circle cx="160" cy="98" r="2" fill="currentColor" opacity="0.4" />
                <circle cx="200" cy="98" r="2" fill="currentColor" opacity="0.4" />
                <circle cx="240" cy="98" r="2" fill="currentColor" opacity="0.4" />
                <circle cx="280" cy="98" r="2" fill="currentColor" opacity="0.4" />
                <circle cx="320" cy="98" r="2" fill="currentColor" opacity="0.4" />
              </svg>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white xl:text-3xl">
                  {stat.display}
                </div>
                <div className="mt-1 text-xs font-medium text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex flex-1 items-center justify-center bg-[#f8fafc] p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
