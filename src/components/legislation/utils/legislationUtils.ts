
// Truncate description to avoid overly long texts
export const truncateDescription = (text: string, maxLength = 150) => {
  if (!text) return "";
  
  // Strip HTML tags
  const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.substring(0, maxLength)}...`;
};

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getRiskColor = (score: number) => {
  if (score >= 8) return "text-red-500";
  if (score >= 5) return "text-orange-500";
  return "text-green-500";
};

export const getRiskBadgeVariant = (level: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (level.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    default:
      return "outline";
  }
};
