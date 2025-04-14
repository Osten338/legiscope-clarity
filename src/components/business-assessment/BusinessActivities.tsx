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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { BusinessAssessmentForm } from "./types";
import { AlertCircle } from "lucide-react";

interface BusinessActivitiesProps {
  form: UseFormReturn<BusinessAssessmentForm>;
}

export const BusinessActivities = ({ form }: BusinessActivitiesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Business Activities and Customers</h2>
      
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Your core business activities and customer type are critical for determining which sector-specific EU regulations apply to your company.
        </AlertDescription>
      </Alert>
      
      <FormField
        control={form.control}
        name="industryClassification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Industry Sector</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Financial Services</SelectItem>
                <SelectItem value="technology">Technology/IT</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail/E-commerce</SelectItem>
                <SelectItem value="telecom">Telecommunications</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="transportation">Transportation/Logistics</SelectItem>
                <SelectItem value="food">Food & Beverage</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Sector-specific EU legislation often applies based on your industry
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subIndustry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sub-industry/Specialization (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Medical devices, Mobile apps, Organic food" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="coreBusinessActivities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Core Business Activities</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe in detail what your company does, its products, services, and main operations" 
                {...field} 
                className="min-h-32"
              />
            </FormControl>
            <FormDescription>
              Be specific about your company's activities as many EU laws apply based on specific business functions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="b2b" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Business-to-Business (B2B) only
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="b2c" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Business-to-Consumer (B2C) only
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="both" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Both B2B and B2C
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              B2C operations trigger EU consumer protection laws that don't apply to pure B2B activities
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
