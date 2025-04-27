
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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

export const RegulationsList = ({
  savedRegulations,
  openRegulation,
  setOpenRegulation
}: RegulationsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const backgroundImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  ];

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Active Regulations</h2>
          <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
            {savedRegulations.length} active
          </Badge>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {savedRegulations.map((regulation, index) => (
              <CarouselItem key={regulation.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative h-[250px] w-full overflow-hidden rounded-xl group">
                  <img
                    src={backgroundImages[index % backgroundImages.length]}
                    alt={regulation.regulations.name}
                    className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 mix-blend-multiply" />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
                      >
                        <X className="h-4 w-4 text-white" />
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
                  
                  <Link 
                    to={`/legislation/${regulation.regulations.id}`} 
                    className="absolute inset-0 p-4 flex flex-col justify-end hover:no-underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenRegulation(openRegulation === regulation.regulations.id ? null : regulation.regulations.id);
                    }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {regulation.regulations.name}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2">
                      {regulation.regulations.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/90 text-sm">
                        Progress: {regulation.progress}%
                      </span>
                      <span className="text-white/90 text-sm capitalize">
                        {regulation.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
};
