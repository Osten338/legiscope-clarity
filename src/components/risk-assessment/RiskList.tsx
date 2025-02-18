
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Risk {
  id: string;
  title: string;
  description: string;
  likelihood: number;
  impact: number;
  level: 'low' | 'medium' | 'high';
  category: 'compliance' | 'operational' | 'financial' | 'reputational';
  status: string;
  due_date: string | null;
  regulations?: { name: string } | null;
  is_generated?: boolean;
}

interface RiskListProps {
  risks: Risk[];
}

export const RiskList = ({ risks }: RiskListProps) => {
  const getLevelColor = (level: Risk['level']) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-serif">Title</TableHead>
            <TableHead className="font-serif">Category</TableHead>
            <TableHead className="font-serif">Risk Level</TableHead>
            <TableHead className="font-serif">Related Regulation</TableHead>
            <TableHead className="font-serif">Status</TableHead>
            <TableHead className="font-serif">Due Date</TableHead>
            <TableHead className="font-serif">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk) => (
            <TableRow key={risk.id}>
              <TableCell className="font-medium font-serif">{risk.title}</TableCell>
              <TableCell className="capitalize font-serif">{risk.category}</TableCell>
              <TableCell>
                <Badge className={getLevelColor(risk.level)}>
                  {risk.level}
                </Badge>
              </TableCell>
              <TableCell className="font-serif">{risk.regulations?.name || 'N/A'}</TableCell>
              <TableCell className="capitalize font-serif">{risk.status}</TableCell>
              <TableCell className="font-serif">
                {risk.due_date 
                  ? new Date(risk.due_date).toLocaleDateString() 
                  : 'No due date'}
              </TableCell>
              <TableCell>
                <Badge variant={risk.is_generated ? "secondary" : "default"}>
                  {risk.is_generated ? 'Generated' : 'Custom'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
