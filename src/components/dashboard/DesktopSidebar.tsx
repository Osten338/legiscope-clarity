
import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarNavigation } from "./SidebarNavigation";
import { Icons } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const DesktopSidebar = ({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <motion.div
      className={cn(
        "h-full flex flex-col gap-y-5 overflow-y-auto border-r border-neutral-200 bg-neutral-100/80 backdrop-blur-md px-6 pb-4",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <div className="flex h-16 shrink-0 items-center">
        <Icons.logo className="h-8 w-8 text-brand" />
      </div>
      
      <nav className="flex flex-1 flex-col">
        <SidebarNavigation />
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <Link 
              to="/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-brand"
            >
              <Settings className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-brand" />
              <motion.span
                animate={{
                  display: animate ? (open ? "inline-block" : "none") : "inline-block",
                  opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 text-sm group-hover:translate-x-1 transition duration-150 whitespace-pre inline-block"
              >
                Settings
              </motion.span>
            </Link>
            <button
              onClick={handleSignOut}
              className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-6 w-6 shrink-0 text-red-400 group-hover:text-red-600" />
              <motion.span
                animate={{
                  display: animate ? (open ? "inline-block" : "none") : "inline-block",
                  opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-red-600 text-sm group-hover:translate-x-1 transition duration-150 whitespace-pre inline-block"
              >
                Sign Out
              </motion.span>
            </button>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};
