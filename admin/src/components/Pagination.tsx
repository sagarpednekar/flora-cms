import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  limitOptions?: number[];
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
};

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  limitOptions = [...LIMIT_OPTIONS],
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const l = Number(e.target.value);
    if (l > 0) onLimitChange(l);
  };

  // Page numbers to show: first, last, current and neighbours, with ellipsis gaps
  const pageNumbers = ((): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [];
    const showLeft = page > 2;
    const showRight = page < totalPages - 1;
    pages.push(1);
    if (showLeft) pages.push("ellipsis");
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      if (!pages.includes(p)) pages.push(p);
    }
    if (showRight) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  })();

  if (totalPages < 1 && total === 0) {
    return (
      <div className="flex flex-wrap items-center gap-4 py-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="pagination-per-page" className="text-sm text-gray-600 whitespace-nowrap">
            Items per page
          </Label>
          <select
            id="pagination-per-page"
            value={limit}
            onChange={handleLimitChange}
            className={cn(
              "h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            {limitOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500">No items</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="pagination-per-page" className="text-sm text-gray-600 whitespace-nowrap">
            Items per page
          </Label>
          <select
            id="pagination-per-page"
            value={limit}
            onChange={handleLimitChange}
            className={cn(
              "h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            {limitOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} ({total} total)
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((n, i) =>
            n === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-500">
                …
              </span>
            ) : (
              <Button
                key={n}
                variant={n === page ? "default" : "outline"}
                size="sm"
                className="min-w-[2rem]"
                onClick={() => onPageChange(n)}
              >
                {n}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
