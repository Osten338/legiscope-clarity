
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <SidebarProvider>
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};
