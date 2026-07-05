"use client";

import { Loader2, User, Crown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";

export function SocialLoginButtons() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoLogin = async (type: "citizen" | "mp") => {
    setLoading(type);
    try {
      if (type === "citizen") {
        await login("citizen1@example.com", "Password123");
      } else {
        await login("mp.northchennai@gov.in", "Password123");
      }
      toast.success(t("auth.signedInSuccessfully"));
    } catch {
      toast.error(t("auth.invalidCredentials"));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="h-12 gap-2 border-border font-medium hover:bg-muted"
        disabled={loading !== null}
        onClick={() => handleDemoLogin("citizen")}
      >
        {loading === "citizen" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <User className="size-5" />
        )}
        {t("auth.demoCitizen")}
      </Button>
      <Button
        variant="outline"
        className="h-12 gap-2 border-border font-medium hover:bg-muted"
        disabled={loading !== null}
        onClick={() => handleDemoLogin("mp")}
      >
        {loading === "mp" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Crown className="size-5" />
        )}
        {t("auth.demoMP")}
      </Button>
    </div>
  );
}
