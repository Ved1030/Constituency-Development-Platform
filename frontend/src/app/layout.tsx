import type { Metadata } from "next";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-900.css";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Toaster } from "react-hot-toast";
import { I18nProvider } from "@/hooks/i18n-provider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    template: "%s | Constituency Development Platform",
    default: "Constituency Development Platform",
  },
  description:
    "Transforming Citizen Voices into Data-Driven Development Decisions",
  keywords: [
    "constituency development",
    "AI governance",
    "citizen engagement",
    "development planning",
  ],
  openGraph: {
    title: "Constituency Development Platform",
    description:
      "Transforming Citizen Voices into Data-Driven Development Decisions",
    type: "website",
    locale: "en_US",
    siteName: "CDP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <I18nProvider>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </AuthProvider>
        </I18nProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
