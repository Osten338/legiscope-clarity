
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
import { Glow } from "@/components/ui/glow";
import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";

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
    <div className="relative min-h-screen bg-background">
      <Glow variant="top" className="opacity-30" />
      
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DialogContent className="p-0 sm:max-w-[300px] bg-card/80 backdrop-blur-md border-neutral-200 data-[state=open]:duration-300">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-background/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-neutral-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-full rounded-full border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
              />
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="outline" size="icon" className="rounded-full border-neutral-200 bg-white/50 backdrop-blur-md hover:bg-white/80 transition-colors">
                <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs bg-red-500">3</Badge>
                <span className="sr-only">View notifications</span>
                <Bell className="h-4 w-4" />
              </Button>

              {/* Separator */}
              <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-neutral-200" />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1.5 hover:bg-transparent">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                      <span className="text-sm font-medium">TC</span>
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-2 text-sm font-medium text-neutral-900">
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

        <main className="py-10 animate-appear">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
