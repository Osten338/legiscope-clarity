
import { useState } from "react";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  const handleTabChange = (value: string) => {
    console.log("Settings: Tab changed to", value);
    setActiveTab(value);
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <Card className="w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="p-4">
              <TabsTrigger value="account">
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="display">
                Display
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-6">
              <AccountSettings />
            </TabsContent>
            <TabsContent value="notifications" className="p-6">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="display" className="p-6">
              <DisplaySettings />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </TopbarLayout>
  );
};

export default Settings;
