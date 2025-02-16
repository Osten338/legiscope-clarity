
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export const WelcomeCard = () => {
  return (
    <Card className="mb-8 bg-gradient-to-br from-[#E5DEFF] to-white border-none shadow-sm overflow-hidden">
      <CardContent className="flex items-center gap-6 pt-6 relative">
        <div className="w-16 h-16 rounded-full bg-[#D3E4FD] flex items-center justify-center">
          <Shield className="w-8 h-8 text-[#403E43]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-serif text-[#403E43] mb-2">
            Welcome to Your Compliance Dashboard
          </h2>
          <p className="text-[#8A898C] leading-relaxed">
            Stay on top of your regulatory requirements and compliance status.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#FEF7CD]/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
      </CardContent>
    </Card>
  );
};
