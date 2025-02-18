
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  return (
    <div className="flex h-full w-72 flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
      <SidebarHeader mobile={mobile} onClose={onClose} />
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <SidebarNavigation />
          </li>
          <li className="mt-auto">
            <Link
              to="/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
            >
              <Settings
                className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600"
              />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
