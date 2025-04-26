
import { ReactNode } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar-new";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <main>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
