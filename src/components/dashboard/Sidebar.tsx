import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

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

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

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
  const [openState, setOpenState] = useState(false);

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
      {mobile ? (
        <MobileSidebar onClose={onClose} />
      ) : (
        <DesktopSidebar />
      )}
    </SidebarProvider>
  );
};

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
            <SidebarLink 
              link={{
                label: "Settings",
                href: "/settings",
                icon: <Settings className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-brand" />
              }}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-brand" 
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

export const MobileSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { open, setOpen } = useSidebar();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    if (onClose) {
      onClose();
    }
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
            <SidebarLink 
              link={{
                label: "Settings",
                href: "/settings",
                icon: <Settings className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-brand" />
              }}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-brand" 
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
    </>
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
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
