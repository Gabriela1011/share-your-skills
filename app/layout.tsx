import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Logo from "@/components/myComponents/Logo";
import { Toaster } from "@/components/ui/sonner"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ShareYourSkills",
  description: "Because knowledge is meant to be shared.",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <body className="bg-circuit font-sans">
        <header className="sticky top-0 z-40 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white">
          <nav className="w-full max-w-6xl mx-auto px-4 flex justify-between items-center h-full">
            {!user && <Logo />}
            <HeaderAuth />
          </nav>
        </header>

        <div className="flex flex-col items-center w-full pt-5">
          <main className="flex w-full justify-center gap-20 max-w-5xl p-5">
            {children}
          </main>
          <Toaster />

          <footer className="bg-background w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-4 py-8 px-4">
            <p className="text-sm">
              © 2025 ShareYourSkills. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
