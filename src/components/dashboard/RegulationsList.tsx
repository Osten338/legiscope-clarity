
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
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

type RegulationListItem = {
  id: string;
  status: string;
  progress: number;
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

type SortColumn = "name" | "description" | "status" | "progress";

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
    return savedRegulations.filter((regulation) =>
      regulation.regulations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.regulations.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savedRegulations, searchTerm]);

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

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-foreground">Active Regulations</h2>
            <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
              {savedRegulations.length} active
            </Badge>
          </div>
          <Input
            placeholder="Search regulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-96"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Name
                {sortColumn === "name" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                Description
                {sortColumn === "description" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                Status
                {sortColumn === "status" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("progress")}>
                Progress
                {sortColumn === "progress" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
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
      </CardContent>
    </Card>
  );
};
