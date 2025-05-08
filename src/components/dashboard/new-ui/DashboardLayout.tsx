
import { ReactNode } from "react";
import { TopbarLayout } from "./TopbarLayout";

interface DashboardLayoutProps {
  children: ReactNode;
}

// This is a wrapper component that uses TopbarLayout for backward compatibility
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <TopbarLayout>
      {children}
    </TopbarLayout>
  );
}
