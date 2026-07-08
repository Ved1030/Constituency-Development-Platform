export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="h-4 w-3/4 rounded bg-gray-200 mb-3" />
          <div className="h-3 w-1/2 rounded bg-gray-200 mb-2" />
          <div className="h-3 w-full rounded bg-gray-200 mb-2" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-1/4 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-3">
          <div className="h-3 w-1/4 rounded bg-gray-100" />
          <div className="h-3 w-1/4 rounded bg-gray-100" />
          <div className="h-3 w-1/4 rounded bg-gray-100" />
          <div className="h-3 w-1/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 w-1/3 rounded bg-gray-200" />
      <div className="h-4 w-2/3 rounded bg-gray-100" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="h-32 rounded-xl bg-gray-100" />
        <div className="h-32 rounded-xl bg-gray-100" />
        <div className="h-32 rounded-xl bg-gray-100" />
      </div>
      <div className="h-64 rounded-xl bg-gray-100" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
      <div className="h-5 w-1/3 rounded bg-gray-200 mb-4" />
      <div className="h-48 rounded bg-gray-100" />
    </div>
  );
}

export function ListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-gray-100 p-4"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-gray-200" />
            <div className="h-2 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
