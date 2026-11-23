export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 28 28"
        className="size-7"
        fill="none"
      >
        <rect x="2.5" y="6" width="4.4" height="15" rx="2.2" transform="rotate(-14 2.5 6)" fill="var(--accent)" />
        <rect x="9.2" y="6" width="4.4" height="15" rx="2.2" transform="rotate(-14 9.2 6)" fill="var(--mark)" />
        <rect x="15.9" y="6" width="4.4" height="15" rx="2.2" transform="rotate(-14 15.9 6)" fill="var(--primary)" />
        <circle cx="24" cy="8.5" r="2.3" fill="var(--ink)" />
      </svg>
      <span className="font-heading text-lg font-semibold tracking-tight text-ink">Liniswara</span>
    </span>
  );
}
