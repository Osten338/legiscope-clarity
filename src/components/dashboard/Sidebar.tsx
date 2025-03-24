
import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(true);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      <SidebarBody mobile={mobile} onClose={onClose} />
    </SidebarProvider>
  );
};

export const SidebarBody = ({ mobile, onClose }: SidebarProps) => {
  return (
    <>
      {mobile ? (
        <MobileSidebarContent onClose={onClose} />
      ) : (
        <DesktopSidebarContent />
      )}
    </>
  );
};

export const DesktopSidebarContent = () => {
  const { open, setOpen, animate } = useSidebar();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  
  return (
    <motion.div
      className="h-full flex flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4"
      animate={{
        width: animate ? (open ? "18rem" : "5rem") : "18rem",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarHeader />
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <SidebarNavigation />
          </li>
          <li className="mt-auto space-y-2">
            <SidebarLink 
              link={{
                label: "Settings",
                href: "/settings",
                icon: <Settings className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600" />
              }}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600" 
            />
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

export const MobileSidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    if (onClose) {
      onClose();
    }
    await supabase.auth.signOut();
    navigate("/auth");
  };
  
  return (
    <div className="flex h-full w-72 flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
      <SidebarHeader mobile onClose={onClose} />
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <SidebarNavigation />
          </li>
          <li className="mt-auto space-y-2">
            <Link
              to="/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
            >
              <Settings
                className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600"
              />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut
                className="h-6 w-6 shrink-0 text-red-400 group-hover:text-red-600"
              />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-slate-700 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
