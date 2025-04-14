
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BusinessAssessmentForm } from "./types";

interface ExistingComplianceProps {
  form: UseFormReturn<BusinessAssessmentForm>;
}

export const ExistingCompliance = ({ form }: ExistingComplianceProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Existing Compliance Information</h2>
      
      <FormField
        control={form.control}
        name="knownRegulations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Known Applicable Regulations</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List any specific EU regulations you're already aware of that apply to your business" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="existingCompliance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Existing Compliance Measures</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe any compliance measures, certifications, or frameworks you already have in place" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
