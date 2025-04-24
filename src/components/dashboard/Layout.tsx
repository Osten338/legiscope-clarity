
import { useState, ReactNode } from "react";
import { FlowbiteSidebar } from "./FlowbiteSidebar";
import { Bell, LogOut, Menu as MenuIcon, Search, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar, Dropdown, Avatar } from 'flowbite-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar fluid className="fixed z-30 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center p-2 text-sm rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="sidebar"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <Navbar.Link href="/dashboard" className="ml-2">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Dashboard
            </span>
          </Navbar.Link>
        </div>
        
        <div className="flex md:order-2 items-center gap-3">
          <div className="hidden lg:flex lg:w-96">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search..."
              />
            </div>
          </div>
          
          <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="w-5 h-5" />
          </button>
          
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <div className="px-4 py-3">
              <span className="block text-sm">Tom Cook</span>
              <span className="block text-sm font-medium truncate">tom@example.com</span>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item icon={Settings} onClick={() => navigate("/settings")}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item icon={LogOut} onClick={handleSignOut}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>

      <div className="flex pt-16">
        <aside
          id="sidebar"
          className={`fixed top-0 left-0 z-20 flex-col flex-shrink-0 w-64 h-full pt-16 duration-75 lg:flex transition-width transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          aria-label="Sidebar"
        >
          <FlowbiteSidebar />
        </aside>
        <div className="flex-1 h-full lg:ml-64">
          <main className="h-full p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
