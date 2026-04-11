import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TransactionPagination({
  currentPage,
  totalPages,
  onPageChange,
}: TransactionPaginationProps) {
  if (totalPages <= 1) return null;

  const generatePagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(0, 1, 2, 3, "ellipsis", totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          0,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        );
      } else {
        pages.push(
          0,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages - 1,
        );
      }
    }
    return pages;
  };

  return (
    <div className="pt-8 pb-4">
      <Pagination>
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              className={cn(
                "cursor-pointer rounded-full font-black uppercase text-[10px] tracking-widest px-4",
                currentPage === 0 && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {generatePagination().map((p, i) => (
            <PaginationItem key={i}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(p as number)}
                  isActive={currentPage === p}
                  className={cn(
                    "cursor-pointer rounded-full font-black text-xs w-10 h-10",
                    currentPage === p &&
                      "bg-primary text-primary-foreground shadow-md hover:text-primary-foreground",
                  )}
                >
                  {(p as number) + 1}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              className={cn(
                "cursor-pointer rounded-full font-black uppercase text-[10px] tracking-widest px-4",
                currentPage >= totalPages - 1 &&
                  "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
