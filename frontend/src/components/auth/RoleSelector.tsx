"use client";

import { User, Shield, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: "citizen" | "mp" | "admin";
  onChange: (value: "citizen" | "mp" | "admin") => void;
}

const roles = [
  { value: "citizen" as const, label: "Citizen", icon: User, description: "Report issues & vote" },
  { value: "mp" as const, label: "MP", icon: Crown, description: "Manage constituency" },
  { value: "admin" as const, label: "Admin", icon: Shield, description: "Platform admin" },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Sign in as</label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => onChange(role.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all",
              value === role.value
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted"
            )}
          >
            <role.icon className="size-5" />
            <span className="text-xs font-semibold">{role.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
