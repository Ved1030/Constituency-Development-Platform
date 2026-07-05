import { User, LoginCredentials, AuthService } from "@/types/auth";
import { mockUsers } from "./mockUsers";

const USER_STORAGE_KEY = "cdp_user";

class MockAuthService implements AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Store user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const mockAuthService = new MockAuthService();

// Helper to get redirect path based on user role
export function getRedirectPath(role: string): string {
  if (role === "mp") {
    return "/mp/dashboard";
  }
  return "/citizen/dashboard";
}

// Helper to check if a route is protected and requires a specific role
export function isProtectedRoute(pathname: string): { protected: boolean; requiredRole?: string } {
  if (pathname.startsWith("/citizen")) {
    return { protected: true, requiredRole: "citizen" };
  }
  if (pathname.startsWith("/mp")) {
    return { protected: true, requiredRole: "mp" };
  }
  return { protected: false };
}
