import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { BusinessAssessmentForm } from "./types";
import { AlertCircle } from "lucide-react";

interface CompanyInformationStepProps {
  form: UseFormReturn<BusinessAssessmentForm>;
}

export const CompanyInformationStep = ({ form }: CompanyInformationStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Core Company Information</h2>
      
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This information helps establish your company's size and structure, which determines which EU regulations apply.
        </AlertDescription>
      </Alert>
      
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="employeeCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Employees</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter employee count" {...field} />
              </FormControl>
              <FormDescription>
                Employee count affects applicability of certain EU directives (e.g., Whistleblower Protection)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearEstablished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Established</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="businessStructure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Structure</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select business structure" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="limitedCompany">Private Limited Company (Ltd)</SelectItem>
                <SelectItem value="plc">Public Limited Company (PLC)</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="soleTrader">Sole Trader</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
