
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export const WelcomeCard = () => {
  return (
    <Card className="mb-8 bg-card/80 border-neutral-200 backdrop-blur-md">
      <CardContent className="flex items-center gap-6 pt-6 animate-appear">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-brand" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-neutral-900 mb-2">
            Welcome to Your Compliance Dashboard
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Stay on top of your regulatory requirements and compliance status.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
