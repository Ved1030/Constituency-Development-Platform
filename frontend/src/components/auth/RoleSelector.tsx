"use client";

import { User, Shield, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface RoleSelectorProps {
  value: "citizen" | "mp" | "admin";
  onChange: (value: "citizen" | "mp" | "admin") => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const { t } = useTranslation();

  const roles = [
    { value: "citizen" as const, label: t("auth.citizen"), icon: User, description: t("auth.citizenDesc") },
    { value: "mp" as const, label: t("auth.mp"), icon: Crown, description: t("auth.mpDesc") },
    { value: "admin" as const, label: t("auth.admin"), icon: Shield, description: t("auth.adminDesc") },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{t("auth.signInAs")}</label>
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
