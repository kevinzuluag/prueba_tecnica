import { Users } from 'lucide-react';

export function EmptyState({ title = 'No se encontraron usuarios', message }) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-12 px-6 text-center"
      role="status"
    >
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Users className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-700 sm:text-lg">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {message || 'Prueba a cambiar los filtros o el término de búsqueda.'}
      </p>
    </div>
  );
}
