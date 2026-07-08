"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { Profile, SignupData } from "@/types/auth";
import { supabaseAuthService } from "@/services/auth/supabaseAuthService";

// ── Route helpers ──────────────────────────────────────────────────────────

export function getRedirectPath(profile: Profile): string {
  return profile.role === "mp" ? "/mp/dashboard" : "/citizen/dashboard";
}

export function isProtectedRoute(
  pathname: string,
): { protected: boolean; requiredRole?: "citizen" | "mp" } {
  if (pathname.startsWith("/citizen")) {
    return { protected: true, requiredRole: "citizen" };
  }
  if (pathname.startsWith("/mp")) {
    return { protected: true, requiredRole: "mp" };
  }
  return { protected: false };
}

// ── Context type ───────────────────────────────────────────────────────────

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    data: SignupData,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserInitials: () => string;
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On mount, restore session from Supabase
  useEffect(() => {
    supabaseAuthService.refreshSession().then((profile) => {
      if (profile) {
        setUser(profile);
      }
      setIsLoading(false);
    });
  }, []);

  // Route guard
  useEffect(() => {
    if (isLoading) return;

    const { protected: isProtected, requiredRole } =
      isProtectedRoute(pathname);

    if (isProtected && !user) {
      router.replace("/login");
      return;
    }

    if (isProtected && user && requiredRole && user.role !== requiredRole) {
      router.replace(getRedirectPath(user));
      return;
    }
  }, [user, isLoading, pathname, router]);

  // ── Login ──────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      const profile = await supabaseAuthService.login({ email, password });
      setUser(profile);
      router.replace(getRedirectPath(profile));
    },
    [router],
  );

  // ── Signup ────────────────────────────────────────────────────────────
  const signupFn = useCallback(
    async (data: SignupData) => {
      const result = await supabaseAuthService.signup(data);

      if (result.user) {
        // Auto-login: email confirmation is disabled, session is live
        setUser(result.user);
        router.replace(getRedirectPath(result.user));
      }

      return { needsEmailConfirmation: result.needsEmailConfirmation };
    },
    [router],
  );

  // ── Forgot password ──────────────────────────────────────────────────
  const forgotPassword = useCallback(async (email: string) => {
    await supabaseAuthService.forgotPassword(email);
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabaseAuthService.logout();
    setUser(null);
    router.replace("/login");
  }, [router]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const getUserInitials = useCallback(() => {
    if (!user) return "";
    return user.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup: signupFn,
        forgotPassword,
        logout,
        getUserInitials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
