export function UserCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-3 w-48 max-w-full rounded bg-slate-100" />
          <div className="flex gap-2 pt-1">
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserListSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}
