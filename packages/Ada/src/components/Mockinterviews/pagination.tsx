import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 5; // you can adjust this

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
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>

      {start > 1 && (
        <>
          <Button onClick={() => onPageChange(1)} variant="outline">
            1
          </Button>
          {start > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'default' : 'outline'}
        >
          {page}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2">...</span>}
          <Button onClick={() => onPageChange(totalPages)} variant="outline">
            {totalPages}
          </Button>
        </>
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}
