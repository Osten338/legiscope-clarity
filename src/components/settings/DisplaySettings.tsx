
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Settings2 } from "lucide-react";

export const DisplaySettings = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sun className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Display Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base mb-4 block">Theme</Label>
          <RadioGroup defaultValue="light" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-100 p-4 hover:bg-slate-200 peer-data-[state=checked]:border-sage-600 [&:has([data-state=checked])]:border-sage-600"
              >
                <Sun className="mb-3 h-6 w-6" />
                Light
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-100 p-4 hover:bg-slate-200 peer-data-[state=checked]:border-sage-600 [&:has([data-state=checked])]:border-sage-600"
              >
                <Moon className="mb-3 h-6 w-6" />
                Dark
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-100 p-4 hover:bg-slate-200 peer-data-[state=checked]:border-sage-600 [&:has([data-state=checked])]:border-sage-600"
              >
                <Settings2 className="mb-3 h-6 w-6" />
                System
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
};
