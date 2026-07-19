import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
      case "COMPLETED":
      case "ACTIVE":
      case "DELIVERED":
        return "default";
      case "PENDING":
      case "PROCESSING":
      case "SHIPPED":
        return "secondary";
      case "REJECTED":
      case "FAILED":
      case "CANCELLED":
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Handle undefined/null status
  if (!status) {
    return (
      <Badge variant="outline" className={cn("", className)}>
        N/A
      </Badge>
    );
  }

  return (
    <Badge
      variant={getVariant(status)}
      className={cn(
        getVariant(status) === "destructive" || getVariant(status) === "default" ? "text-white" : "",
        className
      )}
    >
      {status}
    </Badge>
  );
}
