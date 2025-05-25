
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Regulation {
  id: string;
  name: string;
}

interface PolicyRegulationSelectorProps {
  regulations: Regulation[] | undefined;
  selectedRegulation: string | undefined;
  onRegulationChange: (value: string | undefined) => void;
}

export const PolicyRegulationSelector = ({
  regulations,
  selectedRegulation,
  onRegulationChange
}: PolicyRegulationSelectorProps) => {
  if (!regulations || regulations.length === 0) {
    return null;
  }

  return (
    <Select
      value={selectedRegulation || ""}
      onValueChange={(value) => onRegulationChange(value || undefined)}
    >
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a regulation..." />
      </SelectTrigger>
      <SelectContent>
        {regulations.map((reg) => (
          <SelectItem key={reg.id} value={reg.id}>
            {reg.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
