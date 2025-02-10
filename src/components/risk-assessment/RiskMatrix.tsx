
import { Card } from "@/components/ui/card";

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
    if (score <= 6) return 'bg-green-100 hover:bg-green-200';
    if (score <= 15) return 'bg-yellow-100 hover:bg-yellow-200';
    return 'bg-red-100 hover:bg-red-200';
  };

  return (
    <Card className="p-6">
      <div className="flex mb-2">
        <div className="w-20" /> {/* Spacer for y-axis label */}
        <div className="flex-1 grid grid-cols-5 gap-2 text-center font-medium">
          {[1, 2, 3, 4, 5].map(impact => (
            <div key={impact}>Impact {impact}</div>
          ))}
        </div>
      </div>

      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center mb-2">
          <div className="w-20 text-right pr-2 font-medium">
            Likelihood {5 - rowIndex}
          </div>
          <div className="flex-1 grid grid-cols-5 gap-2">
            {row.map((risks, colIndex) => (
              <div
                key={colIndex}
                className={`${getLevelColor(rowIndex, colIndex)} p-2 rounded min-h-20 text-sm`}
              >
                {risks.map((risk: Risk) => (
                  <div key={risk.id} className="mb-1 truncate">
                    {risk.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
};
