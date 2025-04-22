
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { Icons } from "@/components/ui/icons";
import { SidebarNavigation } from "./SidebarNavigation";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const MobileSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { open, setOpen } = useSidebar();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-brand" />
          <span className="font-semibold text-lg">Dashboard</span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
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
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-6 w-6 shrink-0 text-red-400 group-hover:text-red-600" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
