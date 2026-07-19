import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  className?: string;
  to?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  to,
}: StatsCardProps) {
  const content = (
    <div className={cn(
      "bg-white dark:bg-[#27292D] border card-border rounded-[10px] 2xl:px-6 px-4 py-5 flex items-center gap-3 shadow-lg shadow-[#2E2D740D] h-full transition-all",
      to && "hover:shadow-xl hover:shadow-[#2E2D7415] hover:border-primary! cursor-pointer",
      className
    )}>
      <div className="2xl:size-11 size-9 rounded-full bg-[#DAF6FF] dark:bg-[#046483] flex items-center justify-center text-[#046483] dark:text-white shrink-0">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-sm text-[#4B5563] dark:text-[#A9B0BA]">{title}</p>
        <p className="md:text-2xl text-xl font-semibold text-[#111827] dark:text-white wrap-anywhere">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link href={to} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

