
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { BusinessAssessmentForm } from "./types";
import { AlertCircle } from "lucide-react";

interface DataTechnologyProps {
  form: UseFormReturn<BusinessAssessmentForm>;
}

export const DataTechnology = ({ form }: DataTechnologyProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Data and Technology Information</h2>
      
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Data handling and specialized technologies trigger specific EU regulations like GDPR, AI Act, and sector-specific requirements.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="handlesPersonalData"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Personal Data Handling</FormLabel>
                <FormDescription>
                  Does your company collect or process personal data of individuals?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="handlesSpecialCategoryData"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Special Category Data</FormLabel>
                <FormDescription>
                  Do you process sensitive data (health, biometric, political opinions, etc.)?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Processing Volume</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data volume" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small">Small (limited data on few individuals)</SelectItem>
                  <SelectItem value="medium">Medium (moderate data processing)</SelectItem>
                  <SelectItem value="large">Large (extensive data on many individuals)</SelectItem>
                  <SelectItem value="veryLarge">Very Large (massive scale data processing)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Large-scale data processing may trigger additional GDPR requirements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Specialized Technologies and Materials</h3>
        
        <FormField
          control={form.control}
          name="usesAI"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Artificial Intelligence (AI)</FormLabel>
                <FormDescription>
                  Does your company develop or use AI systems?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usesChemicals"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Chemical Substances</FormLabel>
                <FormDescription>
                  Do you manufacture, import or use chemical substances?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usesMedicalDevices"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Medical Devices</FormLabel>
                <FormDescription>
                  Does your business involve medical devices or healthcare products?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usesRegulatedProducts"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Other Regulated Products</FormLabel>
                <FormDescription>
                  Do you deal with other heavily regulated products (cosmetics, food, electronics, etc.)?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
