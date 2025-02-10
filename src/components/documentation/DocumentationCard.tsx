
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DocumentationCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const DocumentationCard = ({ title, children, className }: DocumentationCardProps) => {
  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-xl font-semibold text-sage-900 mb-4">{title}</h3>
      <div className="prose prose-sage max-w-none">
        {children}
      </div>
    </Card>
  );
};
