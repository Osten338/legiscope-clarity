
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bell, 
  FileSearch, 
  FileText, 
  Bot, 
  Clipboard, 
  Calendar,
  Menu,
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  isMobile?: boolean;
}

const NavLink = ({ href, children, icon, active, isMobile }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active 
          ? "text-primary bg-primary/10" 
          : "text-neutral-600 hover:text-primary hover:bg-primary/5",
        isMobile && "py-3"
      )}
    >
      {icon && <span className="text-neutral-500">{icon}</span>}
      {children}
    </Link>
  );
};

export function MainNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Alerts",
      href: "/alerts",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      label: "Legislation",
      href: "/legislation",
      icon: <FileSearch className="h-5 w-5" />,
    },
    {
      label: "Documentation",
      href: "/documentation",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "AI Assistant",
      href: "/compliance-chat",
      icon: <Bot className="h-5 w-5" />,
    },
    {
      label: "Compliance Overview",
      href: "/compliance-overview",
      icon: <Clipboard className="h-5 w-5" />,
    },
    {
      label: "Compliance Calendar",
      href: "/compliance-calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm transition-all duration-200">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">C</span>
          </div>
          <span className="font-medium hidden sm:block">Compliance Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <NavLink 
              key={link.href} 
              href={link.href} 
              active={isActive(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-10">
              <nav className="flex flex-col gap-2 mt-4">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.href} 
                    href={link.href} 
                    icon={link.icon}
                    active={isActive(link.href)}
                    isMobile
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink href="/settings" icon={<Settings className="h-5 w-5" />} isMobile>
                  Settings
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
