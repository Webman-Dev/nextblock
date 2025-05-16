import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";
import Header from "@/components/Header";
import { headers } from 'next/headers';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const DEFAULT_LOCALE_FOR_LAYOUT = 'en';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'My Ultra-Fast CMS', // Update as needed
  description: 'A block-based TypeScript CMS with Next.js and Supabase', // Update
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const heads = await headers();
  const serverDeterminedLocale = heads.get('x-user-locale') || DEFAULT_LOCALE_FOR_LAYOUT;

  return (
    <html lang={serverDeterminedLocale} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <LanguageProvider serverLocale={serverDeterminedLocale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="min-h-screen flex flex-col items-center w-full">
                <div className="flex-1 w-full flex flex-col items-center">
                  <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                      {!hasEnvVars ? <EnvVarWarning /> : <Header />}
                    </div>
                  </nav>
                  <div className="flex flex-col w-full">{children}</div>

                  <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                    <ThemeSwitcher />
                  </footer>
                </div>
              </main>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
