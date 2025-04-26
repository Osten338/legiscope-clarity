
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-16 bg-background border-b">
      <div className="flex h-full items-center px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </header>
  );
}
