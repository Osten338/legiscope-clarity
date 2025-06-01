import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bell, FileSearch, FileText, Bot, Clipboard, Calendar, Menu, Settings, X, Package, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const sidebarItems = [{
  name: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard
}, {
  name: "Alerts",
  href: "/alerts",
  icon: Bell
}, {
  name: "Legislation",
  href: "/legislation",
  icon: FileSearch
}, {
  name: "Documentation",
  href: "/documentation",
  icon: FileText
}, {
  name: "AI Assistant",
  href: "/compliance-chat",
  icon: Bot
}, {
  name: "Compliance Overview",
  href: "/compliance-overview",
  icon: Clipboard
}, {
  name: "Compliance Calendar",
  href: "/compliance-calendar",
  icon: Calendar
}, {
  name: "Settings",
  href: "/settings",
  icon: Settings
}];
export function MainNavbar() {
  const location = useLocation();
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme as "dark" | "light");
  }, []);
  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };
  const SidebarContent = () => <div className="flex h-full flex-col gap-2">
      <div className="flex h-[60px] items-center border-b px-6">
        <div className="flex items-center space-x-2 w-full">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">C</span>
          </div>
          <Select defaultValue="compliance">
            <SelectTrigger className="w-full border-none bg-transparent p-0 hover:bg-transparent focus:ring-0">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compliance">
                Compliance Hub
              </SelectItem>
              <SelectItem value="legal">
                Legal Department
              </SelectItem>
              <SelectItem value="risk">
                Risk Management
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 px-3 py-4">
        <div className="mb-4">
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </h3>
          <nav className="flex flex-col gap-1 mt-2">
            {sidebarItems.slice(0, 4).map(item => {
            const Icon = item.icon;
            return <Button key={item.name} variant={isActive(item.href) ? "secondary" : "ghost"} className={cn("w-full justify-start gap-2", isActive(item.href) && "bg-primary/10")} asChild onClick={() => setIsOpen(false)}>
                  <Link to={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>;
          })}
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Compliance Tools
          </h3>
          <nav className="flex flex-col gap-1 mt-2">
            {sidebarItems.slice(4).map(item => {
            const Icon = item.icon;
            return <Button key={item.name} variant={isActive(item.href) ? "secondary" : "ghost"} className={cn("w-full justify-start gap-2", isActive(item.href) && "bg-primary/10")} asChild onClick={() => setIsOpen(false)}>
                  <Link to={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>;
          })}
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Compliance Hub
              </p>
              <p className="text-xs text-muted-foreground">
                v1.2.0
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleToggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full">
            {isMounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>;
  return <>
      {/* Desktop Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[240px] border-r bg-card/40 lg:block hidden">
        <SidebarContent />
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">C</span>
          </div>
          <span className="font-semibold">Plikt AI</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleToggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full">
            {isMounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>;
}