import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { BusinessAssessmentForm } from "./types";
import { AlertCircle } from "lucide-react";

interface GeographicalScopeProps {
  form: UseFormReturn<BusinessAssessmentForm>;
}

export const GeographicalScope = ({ form }: GeographicalScopeProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Geographical Scope</h2>
      
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Cross-border operations affect which EU rules apply and how. Many EU regulations have extraterritorial effect.
        </AlertDescription>
      </Alert>
      
      <FormField
        control={form.control}
        name="primaryLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Country of Operation</FormLabel>
            <FormControl>
              <Input placeholder="Enter primary country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="operatingLocations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Operating Locations</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List other countries/regions where you conduct business" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="crossBorderActivities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cross-Border Activities</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 gap-4"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="none" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    No cross-border activities (single country operation)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="euOnly" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    EU cross-border only (operating in multiple EU states)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="global" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Global operations (including EU and non-EU countries)
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Cross-border operations may invoke specific EU frameworks and obligations
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
