import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
      {pageSize && onPageSizeChange && (
        <div className="flex items-center sm:gap-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8! w-[75px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {totalItems !== undefined && (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Total <span className="font-medium text-accent">{totalItems}</span> {totalItems <= 1 ? "item" : "items"}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="size-9 border hover:bg-[#F5F5F5] dark:hover:bg-[#27292D33] dark:border-[#DADADA1A] text-[#515151] dark:text-[#A1A1A1] transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="size-9 border hover:bg-[#F5F5F5] dark:hover:bg-[#27292D33] dark:border-[#DADADA1A] text-[#515151] dark:text-[#A1A1A1] transition-all cursor-pointer active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

