export type UserRole = "citizen" | "mp";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  constituency: string;
  role: UserRole;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  constituency?: string;
}
