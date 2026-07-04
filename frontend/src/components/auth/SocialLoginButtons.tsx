"use client";

import { Globe, Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function SocialLoginButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoLogin = async (provider: string) => {
    setLoading(provider);
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Logged in with ${provider}`);
    router.push("/citizen/dashboard");
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="h-12 gap-2 border-border font-medium hover:bg-muted"
        disabled={loading !== null}
        onClick={() => handleDemoLogin("Google")}
      >
        {loading === "Google" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Globe className="size-5" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        className="h-12 gap-2 border-border font-medium hover:bg-muted"
        disabled={loading !== null}
        onClick={() => handleDemoLogin("Demo")}
      >
        {loading === "Demo" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Play className="size-5" />
        )}
        Demo
      </Button>
    </div>
  );
}
