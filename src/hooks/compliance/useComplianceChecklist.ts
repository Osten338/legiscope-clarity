
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RegulationType } from "./types";
import {
  fetchSavedRegulations,
  fetchRegulations,
  fetchChecklistItems,
  fetchResponses,
  processChecklistItems
} from "./complianceHelpers";

export const useComplianceChecklist = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          console.log("Current user ID:", user.id);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    
    getUserId();
  }, []);

  const { data: regulations, isLoading, error, refetch } = useQuery({
    queryKey: ["regulations", userId],
    queryFn: async (): Promise<RegulationType[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Step 1: Get saved regulations
        const regulationIds = await fetchSavedRegulations(user.id);
        if (regulationIds.length === 0) return [];
        
        // Step 2: Get regulations basic info
        const regulationsData = await fetchRegulations(regulationIds);
        if (!regulationsData || regulationsData.length === 0) return [];

        // Step 3: Process each regulation
        const result: RegulationType[] = [];
        
        for (const regulation of regulationsData) {
          try {
            // Get all checklist items for this regulation
            const allItems = await fetchChecklistItems(regulation.id);
            
            // Get all item IDs for responses
            const allItemIds = allItems.map(item => item.id);
            
            // Get responses
            const responses = await fetchResponses(user.id, allItemIds);
            
            // Process items
            const processedItems = processChecklistItems(allItems, responses);

            result.push({
              id: regulation.id,
              name: regulation.name,
              description: regulation.description,
              motivation: regulation.motivation,
              requirements: regulation.requirements,
              checklist_items: processedItems,
            });
          } catch (itemError) {
            console.error(`Error processing regulation ${regulation.id}:`, itemError);
            continue;
          }
        }

        console.log("Fetched regulations with items:", result);
        return result;
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    console.log("ComplianceChecklist: Active tab changed to:", activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback((value: string) => {
    console.log("ComplianceChecklist: Tab change handler called with value:", value);
    setActiveTab(value);
  }, []);

  return {
    regulations,
    isLoading,
    error,
    activeTab,
    handleTabChange,
    refetch
  };
};
