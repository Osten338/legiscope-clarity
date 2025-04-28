
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LegislationLoading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest EU Legislation</CardTitle>
        <CardDescription>Loading latest legislation from EUR-Lex...</CardDescription>
      </CardHeader>
      <CardContent>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
