import { Skeleton, SkeletonHeader } from "@/components/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Memuat materi">
      <SkeletonHeader />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-7 w-4/5" />
        <Skeleton className="mt-2 h-4 w-full" />
        {/* Rasio 16/9 dikunci supaya tidak ada pergeseran tata letak saat video siap. */}
        <Skeleton className="mt-5 aspect-video w-full rounded-lg" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-6 h-11 w-44 rounded-sm" />
        <Skeleton className="mt-8 h-4 w-24" />
        <div className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="size-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
