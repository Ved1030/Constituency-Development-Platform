import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Public routes that don't require authentication.
 */
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/",
  "/api",
];

/**
 * Role-based route prefixes.
 */
const MP_PREFIX = "/mp";
const CITIZEN_PREFIX = "/citizen";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the Supabase session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Already authenticated — redirect away from auth pages to correct dashboard
  if (user && ["/login", "/register", "/forgot-password"].includes(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname =
      profile?.role === "mp" ? "/mp/dashboard" : "/citizen/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow public routes
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Protected routes — require auth
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based access
  if (pathname.startsWith(MP_PREFIX)) {
    // Check if user has mp role in profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "mp") {
      // Not an MP — redirect to citizen dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/citizen/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith(CITIZEN_PREFIX)) {
    // Citizens and MPs can both access citizen routes
    // No additional check needed beyond auth
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - maps (public geojson files)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|maps).*)",
  ],
};
