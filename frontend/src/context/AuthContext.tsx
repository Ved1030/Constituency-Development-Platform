"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/auth";
import { mockAuthService, getRedirectPath, isProtectedRoute } from "@/services/auth/mockAuthService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getUserInitials: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const { protected: isProtected, requiredRole } = isProtectedRoute(pathname);

    if (isProtected && !user) {
      router.push("/login");
      return;
    }

    if (isProtected && user && requiredRole && user.role !== requiredRole) {
      router.push(getRedirectPath(user.role));
      return;
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await mockAuthService.login({ email, password });
    setUser(loggedInUser);
    router.push(getRedirectPath(loggedInUser.role));
  }, [router]);

  const logout = useCallback(() => {
    mockAuthService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const getUserInitials = useCallback(() => {
    if (!user) return "";
    return user.name
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
