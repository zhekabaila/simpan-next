import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationProps {
  className?: string;
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  className,
  page,
  pages,
  onPageChange,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Jumlah maksimum halaman yang ditampilkan sebelum menggunakan ellipsis

    if (pages <= maxVisiblePages) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(
          <PaginationItem key={`pagination-ka-${i}`}>
            <PaginationLink
              href="#"
              isActive={i === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={1 === page}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        pageNumbers.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(pages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={`pagination-kb-${i}`}>
            <PaginationLink
              href="#"
              isActive={i === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < pages - 2) {
        pageNumbers.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      pageNumbers.push(
        <PaginationItem key={`pagination-kc-${pages}`}>
          <PaginationLink
            href="#"
            isActive={pages === page}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pages);
            }}
          >
            {pages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <PaginationWrapper
      className={cn(className)}
      currentPage={page}
      onPageChange={onPageChange}
      totalPages={pages}
    >
      <PaginationContent>
        {/* Tombol Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {/* Daftar halaman dengan ellipsis */}
        {renderPageNumbers()}

        {/* Tombol Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            className={page === pages ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => {
              e.preventDefault();
              if (page < pages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationWrapper>
  );
}
