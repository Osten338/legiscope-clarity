
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Risk {
  id: string;
  title: string;
  likelihood: number;
  impact: number;
  level: 'low' | 'medium' | 'high';
}

interface RiskMatrixProps {
  risks: Risk[];
}

export const RiskMatrix = ({ risks }: RiskMatrixProps) => {
  const matrix = Array(5).fill(null).map(() => Array(5).fill([]));
  
  // Populate matrix with risks
  risks.forEach(risk => {
    const row = 5 - risk.likelihood;
    const col = risk.impact - 1;
    matrix[row][col] = [...matrix[row][col], risk];
  });

  const getLevelColor = (row: number, col: number) => {
    const score = (5 - row) * (col + 1);
    if (score <= 6) return 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200';
    if (score <= 15) return 'from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-yellow-200';
    return 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200';
  };

  return (
    <Card className="p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Risk Assessment Matrix</h2>
        <p className="text-sm text-gray-600 mt-2">Likelihood vs Impact Analysis</p>
      </div>

      <div className="flex mb-4">
        <div className="w-24" /> {/* Spacer for y-axis label */}
        <div className="flex-1 grid grid-cols-5 gap-3 text-center">
          {[1, 2, 3, 4, 5].map(impact => (
            <div key={impact} className="font-medium text-sm text-gray-700">
              Impact {impact}
            </div>
          ))}
        </div>
      </div>

      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center mb-3 group">
          <div className="w-24 text-right pr-4">
            <span className="text-sm font-medium text-gray-700">
              Likelihood {5 - rowIndex}
            </span>
          </div>
          <div className="flex-1 grid grid-cols-5 gap-3">
            {row.map((risks, colIndex) => (
              <div
                key={colIndex}
                className={cn(
                  "bg-gradient-to-br border rounded-lg p-3 min-h-24 transition-all duration-200",
                  "shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
                  getLevelColor(rowIndex, colIndex)
                )}
              >
                {risks.map((risk: Risk) => (
                  <div 
                    key={risk.id} 
                    className="mb-2 text-sm font-medium text-gray-800 truncate last:mb-0"
                  >
                    {risk.title}
                  </div>
                ))}
                {risks.length === 0 && (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">No risks</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-green-50 to-green-100 border border-green-200" />
          <span className="text-xs text-gray-600">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200" />
          <span className="text-xs text-gray-600">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-red-50 to-red-100 border border-red-200" />
          <span className="text-xs text-gray-600">High Risk</span>
        </div>
      </div>
    </Card>
  );
};
