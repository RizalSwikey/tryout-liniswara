import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center gap-2 text-sm text-muted-ink" role="status">
      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      Memuat…
    </div>
  );
}
