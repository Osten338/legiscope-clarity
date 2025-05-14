
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
  
  const COLORS = [
    "#10B981", // green for compliant
    "#F87171"  // red for non-compliant
  ];
  
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
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="stroke-background hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {payload[0].name}
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value} regulations
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="flex justify-center gap-4">
                            {payload.map((entry, index) => (
                              <div key={`item-${index}`} className="flex items-center gap-1">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {entry.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
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
