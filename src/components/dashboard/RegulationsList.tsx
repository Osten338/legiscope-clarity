
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Calendar, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { format } from "date-fns";

type RegulationListItem = {
  id: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  regulations: {
    id: string;
    name: string;
    description: string;
  };
};

interface RegulationsListProps {
  savedRegulations: RegulationListItem[];
  openRegulation: string | null;
  setOpenRegulation: (id: string | null) => void;
}

type SortColumn = "name" | "description" | "status" | "progress" | "next_review_date";

type ViewType = "active" | "upcoming" | "tasks";

export const RegulationsList = ({
  savedRegulations,
  openRegulation,
  setOpenRegulation
}: RegulationsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentView, setCurrentView] = useState<ViewType>("active");

  const handleRemoveRegulation = async (savedRegulationId: string) => {
    try {
      const { error } = await supabase.from('saved_regulations').delete().eq('id', savedRegulationId);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['savedRegulations'] });
      toast({
        title: "Regulation removed",
        description: "The regulation has been removed from your dashboard"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove regulation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredRegulations = useMemo(() => {
    let filtered = savedRegulations.filter((regulation) =>
      regulation.regulations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.regulations.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter based on current view
    switch (currentView) {
      case "upcoming":
        filtered = filtered.filter(reg => reg.next_review_date && new Date(reg.next_review_date) > new Date());
        break;
      case "tasks":
        filtered = filtered.filter(reg => reg.progress < 100);
        break;
      default:
        // Show all for "active" view
        break;
    }

    return filtered;
  }, [savedRegulations, searchTerm, currentView]);

  const sortedRegulations = useMemo(() => {
    return [...filteredRegulations].sort((a, b) => {
      let valueA, valueB;

      switch (sortColumn) {
        case "name":
          valueA = a.regulations.name;
          valueB = b.regulations.name;
          break;
        case "description":
          valueA = a.regulations.description;
          valueB = b.regulations.description;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "progress":
          valueA = a.progress;
          valueB = b.progress;
          break;
        case "next_review_date":
          valueA = a.next_review_date || "";
          valueB = b.next_review_date || "";
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRegulations, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case "upcoming":
        return "Upcoming Reviews";
      case "tasks":
        return "Compliance Tasks";
      default:
        return "Active Regulations";
    }
  };

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-foreground">{getViewTitle()}</h2>
              <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
                {sortedRegulations.length} {currentView === "upcoming" ? "pending" : "active"}
              </Badge>
            </div>
            <Input
              placeholder="Search regulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-96"
            />
          </div>

          <Tabs defaultValue="active" onValueChange={(value) => setCurrentView(value as ViewType)} className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Regulations</TabsTrigger>
              <TabsTrigger value="upcoming">
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Reviews
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <ListTodo className="mr-2 h-4 w-4" />
                Compliance Tasks
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  Name
                  {sortColumn === "name" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                  Description
                  {sortColumn === "description" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  {sortColumn === "status" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("progress")}>
                  Progress
                  {sortColumn === "progress" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
                {currentView === "upcoming" && (
                  <TableHead className="cursor-pointer" onClick={() => handleSort("next_review_date")}>
                    Review Date
                    {sortColumn === "next_review_date" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                )}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRegulations.map((regulation) => (
                <TableRow key={regulation.id}>
                  <TableCell className="font-medium">
                    <Link 
                      to={`/legislation/${regulation.regulations.id}`}
                      className="text-foreground hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenRegulation(openRegulation === regulation.regulations.id ? null : regulation.regulations.id);
                      }}
                    >
                      {regulation.regulations.name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {regulation.regulations.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {regulation.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={regulation.progress === 100 ? "default" : "outline"}>
                      {regulation.progress}%
                    </Badge>
                  </TableCell>
                  {currentView === "upcoming" && (
                    <TableCell>
                      {regulation.next_review_date && format(new Date(regulation.next_review_date), 'PPP')}
                    </TableCell>
                  )}
                  <TableCell className="flex gap-1">
                    <Link to={`/legislation/${regulation.regulations.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Regulation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this regulation from your dashboard? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveRegulation(regulation.id)} className="bg-red-500 hover:bg-red-600">
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

