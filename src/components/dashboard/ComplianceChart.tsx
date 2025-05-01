
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface ComplianceChartProps {
  completedRegulations: number;
  totalRegulations: number;
}

export function ComplianceChart({ completedRegulations, totalRegulations }: ComplianceChartProps) {
  const completionPercentage = totalRegulations > 0 
    ? Math.round((completedRegulations / totalRegulations) * 100) 
    : 0;
  
  const incompleteRegulations = totalRegulations - completedRegulations;
  
  const data = [
    { name: 'Compliant', value: completedRegulations, color: '#10B981' }, // green
    { name: 'Non-compliant', value: incompleteRegulations, color: '#F87171' } // red
  ].filter(item => item.value > 0); // Only show segments with values > 0
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compliance Overview</CardTitle>
        <CardDescription>Overall compliance status</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-full h-64 flex items-center justify-center">
          {totalRegulations > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-bold mono">{completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">Compliant</div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available
            </div>
          )}
        </div>
        
        <div className="w-full grid grid-cols-2 gap-4 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{completedRegulations}</div>
            <div className="text-sm text-muted-foreground">Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{incompleteRegulations}</div>
            <div className="text-sm text-muted-foreground">Non-compliant</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
