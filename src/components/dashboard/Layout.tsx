
import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, LogOut, Menu as MenuIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen bg-background dark">
      
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DialogContent className="p-0 sm:max-w-[280px] bg-card/95 backdrop-blur-md border-neutral-800 data-[state=open]:duration-300">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-3 border-b border-border bg-background/95 backdrop-blur-md px-3 shadow-sm sm:gap-x-4 sm:px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2 p-2 text-neutral-400 hover:text-neutral-300 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-5 w-5" />
          </button>

          {/* Separator */}
          <div aria-hidden="true" className="h-5 w-px bg-border lg:hidden" />

          <div className="flex flex-1 gap-x-3 self-stretch lg:gap-x-4">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-input bg-background/50 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring transition-all"
              />
            </div>

            <div className="flex items-center gap-x-3 lg:gap-x-4">
              <Button variant="outline" size="icon" className="rounded-md border-input bg-background/50">
                <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs bg-red-500">3</Badge>
                <span className="sr-only">View notifications</span>
                <Bell className="h-4 w-4" />
              </Button>

              {/* Separator */}
              <div aria-hidden="true" className="hidden lg:block lg:h-5 lg:w-px lg:bg-border" />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1 hover:bg-transparent">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <span className="text-sm font-medium">TC</span>
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-2 text-sm font-medium text-foreground">
                        Tom Cook
                      </span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="p-2 flex flex-col gap-1">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">Tom Cook</p>
                      <p className="text-xs text-muted-foreground">tom@example.com</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    <Icons.radix className="w-4 h-4" />
                    Your profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="flex gap-2 text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="py-6 animate-appear">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
