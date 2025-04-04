
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export const WelcomeCard = () => {
  return (
    <Card className="mb-8 bg-white border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-6 pt-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Shield className="w-8 h-8 text-slate-600" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-slate-900 mb-2">
            Welcome to Your Compliance Dashboard
          </h2>
          <p className="text-slate-600 leading-relaxed font-serif">
            Stay on top of your regulatory requirements and compliance status.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
