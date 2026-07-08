import { Profile, LoginCredentials, SignupData } from "@/types/auth";
import { createClient } from "@/lib/supabase/client";

const SESSION_KEY = "cdp_session";

class SupabaseAuthService {
  /**
   * Sign in with email and password via Supabase Auth.
   * Then fetch the user's profile from the public.profiles table to get role info.
   */
  async login(credentials: LoginCredentials): Promise<Profile> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Invalid email or password");
    }

    // Fetch profile from the public.profiles table
    const profile = await this.fetchProfile(data.user.id);

    // Cache in localStorage for quick access
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    }

    return profile;
  }

  /**
   * Sign up a new user. Creates the account in Supabase Auth.
   * The trigger `on_auth_user_created` auto-creates a profile row.
   * If email confirmation is disabled (recommended), this also returns a session.
   */
  async signup(data: SignupData): Promise<{ user: Profile | null; needsEmailConfirmation: boolean }> {
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.full_name,
          phone: data.phone ?? "",
          constituency: data.constituency ?? "",
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error("Sign up failed. Please try again.");
    }

    // If email confirmation is disabled, we get a session immediately
    if (authData.session) {
      // Profile was auto-created by the DB trigger; fetch it
      const profile = await this.fetchProfile(authData.user.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      }
      return { user: profile, needsEmailConfirmation: false };
    }

    // Email confirmation is required — user needs to verify
    return { user: null, needsEmailConfirmation: true };
  }

  /**
   * Send a password reset email.
   */
  async forgotPassword(email: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign out from Supabase Auth and clear local state.
   */
  async logout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();

    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  /**
   * Get the cached profile from localStorage.
   */
  getCachedProfile(): Profile | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as Profile;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  /**
   * Refresh the session from Supabase and sync the profile.
   * Call this on app mount.
   */
  async refreshSession(): Promise<Profile | null> {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    if (!data?.session?.user) {
      // No active Supabase session
      return null;
    }

    const profile = await this.fetchProfile(data.session.user.id);

    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    }

    return profile;
  }

  /**
   * Fetch a user's profile from the public.profiles table.
   */
  private async fetchProfile(userId: string): Promise<Profile> {
    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      // Profile not found yet — might be a race with the trigger.
      // Wait briefly and retry once.
      await new Promise((r) => setTimeout(r, 500));
      const { data: retryProfile, error: retryError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (retryError || !retryProfile) {
        throw new Error("Failed to load user profile");
      }

      return retryProfile as Profile;
    }

    return profile as Profile;
  }
}

export const supabaseAuthService = new SupabaseAuthService();
