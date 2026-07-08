export type UserRole = "citizen" | "mp";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  constituency: string;
  state: string;
  district: string;
  profilePhoto: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}
