import { Search, MapPin, Globe, Building2, RotateCcw } from 'lucide-react';

export function UserFilters({ search, setSearch, city, setCity, country, setCountry, company, setCompany, filters, onClear }) {
  const hasActiveFilters = search || city || country || company;

  return (
    <div className="space-y-6">
      {/* Búsqueda por texto */}
      <fieldset className="space-y-2">
        <label htmlFor="user-search" className="block text-sm font-medium text-slate-700">
          Búsqueda
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="user-search"
            type="search"
            placeholder="Nombre, email, ciudad, país..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </fieldset>

      {/* Filtros por país, ciudad y empresa */}
      <fieldset className="space-y-2">
        <span className="block text-sm font-medium text-slate-700">Filtrar por</span>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-10 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="País"
            >
              <option value="">Todos los países</option>
              {filters.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-10 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Ciudad"
            >
              <option value="">Todas las ciudades</option>
              {filters.cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-10 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Empresa"
            >
              <option value="">Todas las empresas</option>
              {filters.companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <div className="border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClear}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto sm:px-4"
          >
            <RotateCcw className="h-4 w-4 shrink-0" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
