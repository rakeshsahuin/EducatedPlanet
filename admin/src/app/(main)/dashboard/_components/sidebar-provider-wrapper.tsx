"use client";

import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

interface SidebarProviderWrapperProps {
  children: React.ReactNode;
}

export function SidebarProviderWrapper({ children }: SidebarProviderWrapperProps) {
  const [defaultOpen, setDefaultOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Only run on client
    const savedState = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];

    setDefaultOpen(savedState === 'true');
  }, []);

  // Don't render until client-side hydration is complete
  if (defaultOpen === undefined) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {children}
    </SidebarProvider>
  );
}