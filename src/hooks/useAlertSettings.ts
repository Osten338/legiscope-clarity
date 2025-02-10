
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAlertSettings = () => {
  const { toast } = useToast();

  const { data: alertSettings, refetch } = useQuery({
    queryKey: ["alertSettings"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from("alert_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from("alert_settings")
          .insert([{ user_id: userId }])
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }

      return data;
    },
  });

  const updateAlertSettings = useMutation({
    mutationFn: async (settings: {
      alerts_enabled?: boolean;
      deadline_alerts_enabled?: boolean;
      risk_alerts_enabled?: boolean;
      compliance_alerts_enabled?: boolean;
      system_alerts_enabled?: boolean;
    }) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("alert_settings")
        .update(settings)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alert preferences updated",
        description: "Your alert preferences have been saved",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error updating alert preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { alertSettings, updateAlertSettings };
};
