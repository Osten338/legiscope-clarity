
import { SidebarProvider } from "@/contexts/SidebarContext";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
