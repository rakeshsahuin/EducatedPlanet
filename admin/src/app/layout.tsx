import { ReactNode } from "react";

import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";

import { Toaster } from "@/components/ui/sonner";
import { CustomQueryClientProvider } from "@/components/providers/query-client-provider";
import { ProvidersWrapper } from "@/components/providers/providers-wrapper";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, type ThemeMode } from "@/types/preferences/theme";

import "./globals.css";

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");

  console.log('app stared')
  // Seed database on application startup (only in development/enabled mode)
  if (process.env.SEED_ON_STARTUP === 'true') {
    try {
      // Dynamic import to prevent build-time execution
      const { seedDatabase } = await import("@/lib/seed-database");
      await seedDatabase();
    } catch (error) {
      console.error("Database seeding failed:", error);
      // Don't prevent app startup due to seeding errors
    }
  }

  return (
    <html
      lang="en"
      className={themeMode === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <body className={`${geistMono.className} min-h-screen antialiased`}>
        <PreferencesStoreProvider themeMode={themeMode}>
          <ProvidersWrapper>
            <CustomQueryClientProvider>
              {children}
              <Toaster />
            </CustomQueryClientProvider>
          </ProvidersWrapper>
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
