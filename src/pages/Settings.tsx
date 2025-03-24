
import { motion } from "framer-motion";
import { LogOut, Settings2, User, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-auto"
      >
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-sage-900 dark:text-white">Settings</h1>
              <p className="text-sage-600 dark:text-sage-400 mt-2">
                Manage your account preferences and application settings
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="account" className="space-y-4">
            <TabsList className="dark:bg-slate-800">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Display
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="display">
              <DisplaySettings />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
