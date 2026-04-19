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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="py-4">
      <Pagination>
        <PaginationContent className="gap-3 p-2 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl shadow-2xl">
          {/* NÚT TRƯỚC */}
          <PaginationItem>  
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={cn(
                "flex items-center gap-2 px-4 h-11 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300",
                currentPage === 0 
                  ? "opacity-20 cursor-not-allowed" 
                  : "hover:bg-primary/10 text-primary hover:translate-x-[-2px] active:scale-95"
              )}
            >
              <ChevronLeft size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Trước</span>
            </button>
          </PaginationItem>

          {/* DANH SÁCH TRANG */}
          <div className="flex items-center gap-1.5 px-2 border-x border-white/5">
            {generatePagination().map((p, i) => (
              <PaginationItem key={i}>
                {p === "ellipsis" ? (
                  <div className="w-10 flex justify-center text-muted-foreground/30">
                    <PaginationEllipsis />
                  </div>
                ) : (
                  <button
                    onClick={() => onPageChange(p as number)}
                    className={cn(
                      "w-11 h-11 rounded-2xl font-money text-[14px] font-black transition-all duration-500 relative group",
                      currentPage === p
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110 z-10"
                        : "text-muted-foreground/40 hover:bg-white/10 hover:text-foreground"
                    )}
                  >
                    {(p as number) + 1}
                    {currentPage === p && (
                       <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                )}
              </PaginationItem>
            ))}
          </div>

          {/* NÚT SAU */}
          <PaginationItem>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className={cn(
                "flex items-center gap-2 px-4 h-11 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300",
                currentPage >= totalPages - 1 
                  ? "opacity-20 cursor-not-allowed" 
                  : "hover:bg-primary/10 text-primary hover:translate-x-[2px] active:scale-95"
              )}
            >
              <span className="hidden sm:inline">Sau</span>
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
