export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-8 px-3 rounded-md bg-bg-base text-text-secondary disabled:opacity-40 text-sm"
      >
        Previous
      </button>
      <span className="text-sm text-text-secondary px-2">{page} / {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-8 px-3 rounded-md bg-bg-base text-text-secondary disabled:opacity-40 text-sm"
      >
        Next
      </button>
    </div>
  );
}
