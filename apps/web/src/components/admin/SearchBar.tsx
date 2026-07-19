import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full mb-0">
      <Search className="absolute left-3 top-3.5 size-4 text-accent-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 sm:w-64 w-full border border-default rounded-lg sm:text-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#151515]"
      />
    </div>
  );
}
