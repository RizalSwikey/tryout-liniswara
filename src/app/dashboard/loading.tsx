import { Skeleton, SkeletonHeader } from "@/components/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Memuat dashboard">
      <SkeletonHeader />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Skeleton className="h-7 w-52" />
            <Skeleton className="mt-2 h-5 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Skeleton className="h-5 w-20" />
            <div className="mt-2 rounded-lg border border-line bg-surface p-4">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <Skeleton className="mt-1.5 h-4 w-1/3" />
              <Skeleton className="mt-4 h-11 w-36" />
            </div>
            <Skeleton className="mt-8 h-5 w-40" />
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-4 h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
