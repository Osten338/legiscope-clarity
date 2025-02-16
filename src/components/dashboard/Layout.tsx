
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        {children}
      </div>
    </SidebarProvider>
  );
};
