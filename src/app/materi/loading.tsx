import { Skeleton, SkeletonHeader } from "@/components/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Memuat daftar materi">
      <SkeletonHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-7 w-44" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
        <ul className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded-lg border border-line bg-surface p-4">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-2/5" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
