
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddRegulation = () => {
    // Navigate to the regulations admin page where users can add new regulations
    navigate("/admin/regulations");
    
    toast({
      title: "Navigation",
      description: "Redirecting to Regulations Admin page where you can add new regulations.",
    });
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 border-b py-4 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Compliance Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage your regulatory compliance
            </p>
          </div>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input 
                placeholder="Search regulations..." 
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="default"
              onClick={handleAddRegulation}
            >
              Add Regulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
