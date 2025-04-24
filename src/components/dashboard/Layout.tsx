
import { useState, ReactNode } from "react";
import { FlowbiteSidebar } from "./FlowbiteSidebar";
import { Bell, LogOut, Menu as MenuIcon, Search, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="fixed z-30 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="w-full p-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center p-2 text-sm rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                  Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">Tom Cook</span>
                        <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">tom@example.com</span>
                      </div>
                      <ul className="py-1">
                        <li>
                          <a 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/settings");
                              setProfileDropdownOpen(false);
                            }} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <div className="flex items-center">
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            </div>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleSignOut();
                              setProfileDropdownOpen(false);
                            }} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            <div className="flex items-center">
                              <LogOut className="w-4 h-4 mr-2" />
                              Sign out
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
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
