import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export const WelcomeCard = () => {
  return <Card className="mb-8 bg-gradient-to-br from-[#FDE1D3] to-white border-none shadow-sm">
      <CardContent className="flex items-center gap-6 pt-6 bg-white/[0.42]">
        <div className="w-16 h-16 rounded-full bg-[#FDE1D3] flex items-center justify-center">
          <Shield className="w-8 h-8 text-[#403E43]" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-[#403E43] mb-2">
            Welcome to Your Compliance Dashboard
          </h2>
          <p className="text-[#8A898C] leading-relaxed">
            Stay on top of your regulatory requirements and compliance status.
          </p>
        </div>
      </CardContent>
    </Card>;
};