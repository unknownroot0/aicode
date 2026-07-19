import { LucideIcon, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon; // optional for backward compatibility
  title?: string;
  description?: string;
  message?: string; // some callers use `message`
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title = "",
  description,
  message,
  action,
  className,
}: EmptyStateProps) {
  const desc = description ?? message;
  const IconToRender = Icon ?? Image; // default icon

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
    >
      <IconToRender className="h-12 w-12 text-muted-foreground mb-4" />
      {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
      {desc && <p className="text-sm text-muted-foreground mb-4">{desc}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

