
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Related Regulation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk) => (
            <TableRow key={risk.id}>
              <TableCell className="font-medium">{risk.title}</TableCell>
              <TableCell className="capitalize">{risk.category}</TableCell>
              <TableCell>
                <Badge className={getLevelColor(risk.level)}>
                  {risk.level}
                </Badge>
              </TableCell>
              <TableCell>{risk.regulations?.name || 'N/A'}</TableCell>
              <TableCell className="capitalize">{risk.status}</TableCell>
              <TableCell>
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
