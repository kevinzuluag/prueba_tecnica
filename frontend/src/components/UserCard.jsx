import { Mail, MapPin, Globe, Building2 } from 'lucide-react';

export function UserCard({ user, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user.id)}
      className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-semibold text-indigo-700 group-hover:bg-indigo-200">
          {user.name?.charAt(0) || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-800">{user.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </p>
          {(user.city || user.country || user.company) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              {user.country && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3 shrink-0" />
                  {user.country}
                </span>
              )}
              {user.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {user.city}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 shrink-0" />
                  {user.company}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
