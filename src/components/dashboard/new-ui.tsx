
import {
  LayoutDashboard,
  ShieldCheck,
  ClipboardCheck,
  BookOpen,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../ui/use-theme";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopbarLayoutProps {
  children: React.ReactNode;
}

export function TopbarLayout({ children }: TopbarLayoutProps) {
  return (
    <div className="flex h-screen antialiased text-foreground bg-background">
      <Sheet>
        <SheetTrigger asChild>
          <aside className="fixed left-0 top-0 z-50 flex flex-col items-start justify-start w-60 h-screen p-4 border-r border-r-border/40 bg-secondary/80 backdrop-blur-sm">
            <Sidebar />
          </aside>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="px-4 pb-4 pt-6">
            <SheetTitle>Dashboard Menu</SheetTitle>
            <SheetDescription>
              Manage your account preferences and compliance tasks.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <Sidebar />
        </SheetContent>
      </Sheet>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  current: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SidebarLink({ to, current, icon, children }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={cn(
        "group flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline",
        current
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {children}
    </NavLink>
  );
}

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <span className="sr-only">Light</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
      >
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Dark</span>
      </Button>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  
  const themeIcon = resolvedTheme === "dark" ? (
    <Sun className="mr-2 h-4 w-4" />
  ) : (
    <Moon className="mr-2 h-4 w-4" />
  );

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <SidebarLink 
              to="/dashboard" 
              current={location.pathname === '/dashboard'}
              icon={<LayoutDashboard className="mr-2 h-4 w-4" />}
            >
              Overview
            </SidebarLink>
            <SidebarLink 
              to="/compliance-overview" 
              current={location.pathname === '/compliance-overview'}
              icon={<ShieldCheck className="mr-2 h-4 w-4" />}
            >
              Compliance Overview
            </SidebarLink>
            <SidebarLink 
              to="/compliance-checklist" 
              current={location.pathname === '/compliance-checklist'}
              icon={<ClipboardCheck className="mr-2 h-4 w-4" />}
            >
              Compliance Checklist
            </SidebarLink>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Management
          </h2>
          <div className="space-y-1">
            <SidebarLink 
              to="/admin/regulations" 
              current={location.pathname.startsWith('/admin/regulations')}
              icon={<BookOpen className="mr-2 h-4 w-4" />}
            >
              Regulation Catalog
            </SidebarLink>
          </div>
        </div>
        
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="justify-start px-2">
              {themeIcon}
              Toggle Theme
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
