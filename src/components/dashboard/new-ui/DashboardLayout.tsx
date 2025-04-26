
import { ReactNode, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-full">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          
          <main className="flex-1 overflow-y-auto transition-[padding] duration-300">
            <div className={`mx-auto max-w-7xl p-6 ${sidebarOpen ? 'lg:pl-8' : 'lg:pl-24'}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
