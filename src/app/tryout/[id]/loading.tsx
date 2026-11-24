import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Memuat tryout">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-11 w-24" />
          </div>
        </div>
        <div className="h-1 w-full bg-line" />
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28">
        <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-11/12" />
          <Skeleton className="mt-2 h-4 w-3/5" />
        </div>
        <Skeleton className="mt-5 h-4 w-64" />
        <div className="mt-2 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-line bg-surface p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-2/3" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Skeleton className="h-11" />
                <Skeleton className="h-11" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
