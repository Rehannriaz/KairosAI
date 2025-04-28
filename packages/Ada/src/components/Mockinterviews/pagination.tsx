'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 5; // Adjust if needed

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < MAX_VISIBLE_PAGES) {
    if (start === 1) {
      end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }
  }

  const pageNumbers = [];
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6 text-sm md:text-base">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="px-2 md:px-4"
      >
        Previous
      </Button>

      {start > 1 && (
        <>
          <Button
            onClick={() => onPageChange(1)}
            variant="outline"
            className="px-2 md:px-4"
          >
            1
          </Button>
          {start > 2 && <span className="text-muted-foreground mx-1">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'default' : 'outline'}
          className="px-2 md:px-4"
        >
          {page}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="text-muted-foreground mx-1">...</span>
          )}
          <Button
            onClick={() => onPageChange(totalPages)}
            variant="outline"
            className="px-2 md:px-4"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="px-2 md:px-4"
      >
        Next
      </Button>
    </div>
  );
}
