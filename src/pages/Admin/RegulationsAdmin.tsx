
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import { RegulationFormDialog, AddRegulationButton } from "@/components/admin/regulations/RegulationFormDialog";
import { DuplicateRegulationsDialog } from "@/components/admin/regulations/DuplicateRegulationsDialog";
import { RegulationsList } from "@/components/admin/regulations/RegulationsList";
import { ImportExportTab } from "@/components/admin/regulations/ImportExportTab";
import { useRegulations } from "@/hooks/useRegulations";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

const RegulationsAdmin = () => {
  const navigate = useNavigate();
  const { 
    regulations, 
    isLoading, 
    duplicates, 
    checklistCounts, 
    fetchRegulations, 
    deleteRegulation 
  } = useRegulations();
  
  const [isRegulationDialogOpen, setIsRegulationDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [currentRegulation, setCurrentRegulation] = useState<Regulation | null>(null);
  const [activeTab, setActiveTab] = useState("regulations");
  const dialogOpenedRef = useRef(false);

  // Extended debug logging for dialog state
  useEffect(() => {
    console.log("RegulationsAdmin - Dialog open state changed:", isRegulationDialogOpen);
    
    // Log dialog element presence in the DOM
    setTimeout(() => {
      const dialogElements = document.querySelectorAll('[role="dialog"]');
      console.log("Dialog elements in DOM:", dialogElements.length);
    }, 100);
  }, [isRegulationDialogOpen]);

  const openRegulationDialog = (regulation?: Regulation) => {
    console.log("Opening regulation dialog", regulation ? "with regulation" : "for new regulation");
    
    if (regulation) {
      setCurrentRegulation(regulation);
    } else {
      setCurrentRegulation(null);
    }
    
    // Update dialog state directly without setTimeout
    setIsRegulationDialogOpen(true);
    dialogOpenedRef.current = true;
    
    // Double-check dialog state after a short delay
    setTimeout(() => {
      console.log("Dialog state after delay:", isRegulationDialogOpen);
      if (!isRegulationDialogOpen && dialogOpenedRef.current) {
        console.log("Dialog state inconsistent, forcing update");
        setIsRegulationDialogOpen(true);
      }
    }, 100);
  };

  const handleAddRegulationClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Add regulation button clicked in parent");
    openRegulationDialog();
  };

  const navigateToChecklistEditor = (regulationId: string) => {
    navigate(`/admin/regulations/${regulationId}/checklist`);
  };

  const getDuplicatesCount = () => {
    return Object.keys(duplicates).length;
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Regulations Administration</h1>
            <p className="text-muted-foreground">
              Manage compliance regulations and expert checklists
            </p>
          </div>
          
          {/* Direct button implementation as fallback */}
          <Button 
            type="button" 
            onClick={handleAddRegulationClick} 
            className="z-10"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Regulation
          </Button>
        </div>

        {getDuplicatesCount() > 0 && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Duplicate Regulations Detected</AlertTitle>
            <AlertDescription>
              We found {getDuplicatesCount()} regulation name(s) with duplicates. 
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => setIsDuplicateDialogOpen(true)}
              >
                Manage Duplicates
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs 
          defaultValue="regulations" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
            <TabsTrigger value="import">Import/Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regulations">
            <RegulationsList 
              regulations={regulations}
              checklistCounts={checklistCounts}
              onEditRegulation={openRegulationDialog}
              onDeleteRegulation={deleteRegulation}
              onAddClick={handleAddRegulationClick}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="import">
            <ImportExportTab />
          </TabsContent>
        </Tabs>

        {/* Dialogs - moved outside of Tabs component for better rendering */}
        <RegulationFormDialog
          regulation={currentRegulation}
          isOpen={isRegulationDialogOpen}
          onOpenChange={setIsRegulationDialogOpen}
          onSuccess={fetchRegulations}
        />

        <DuplicateRegulationsDialog
          duplicates={duplicates}
          checklistCounts={checklistCounts}
          isOpen={isDuplicateDialogOpen}
          onOpenChange={setIsDuplicateDialogOpen}
          onSuccess={fetchRegulations}
          onNavigateToChecklist={navigateToChecklistEditor}
        />
      </div>
    </TopbarLayout>
  );
};

export default RegulationsAdmin;
