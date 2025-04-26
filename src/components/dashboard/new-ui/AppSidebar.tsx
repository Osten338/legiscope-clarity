
import { Calendar, Home, FileText, Bell, CheckSquare, Bot, Settings } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-new";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Risk Assessment",
    href: "/risk-assessment",
    icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: <Bell className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Compliance",
    href: "/compliance-checklist",
    icon: <CheckSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Documentation",
    href: "/documentation",
    icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "AI Assistant",
    href: "/compliance-chat",
    icon: <Bot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);
  
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Logo />
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                link={{
                  ...link,
                  href: link.href,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Settings",
              href: "/settings",
              icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-black dark:text-white whitespace-pre">
        Compliance Hub
      </span>
    </Link>
  );
};
