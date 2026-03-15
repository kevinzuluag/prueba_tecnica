import { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '../hooks/useUsers';
import { useUserDetail } from '../hooks/useUserDetail';
import { UserCard } from '../components/UserCard';
import { UserFilters } from '../components/UserFilters';
import { UserListSkeleton } from '../components/UserCardSkeleton';
import { EmptyState } from '../components/EmptyState';
import { UserDetailModal } from '../components/UserDetailModal';
import { CreateUserForm } from '../components/CreateUserForm';

export function UserExplorerPage() {
  const {
    users,
    filters,
    loading,
    error,
    search,
    setSearch,
    city,
    setCity,
    country,
    setCountry,
    company,
    setCompany,
    createUser,
    updateUser,
    deleteUser,
    clearFilters,
  } = useUsers();

  const { user, loading: detailLoading, openDetail, closeDetail } = useUserDetail();
  const [showForm, setShowForm] = useState(false);

  const handleCreateUser = async (data) => {
    await createUser(data);
    toast.success('Usuario creado correctamente');
    setShowForm(false);
  };

  const handleUpdateUser = async (id, data) => {
    try {
      await updateUser(id, data);
      await openDetail(id);
      toast.success('Usuario actualizado');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      toast.success('Usuario eliminado');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header: título y acción principal */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white sm:h-10 sm:w-10">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              User Explorer
            </h1>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <UserPlus className="h-4 w-4 shrink-0" />
              Nuevo usuario
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal: filtros + listado */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Panel de filtros (izquierda en desktop, arriba en móvil) */}
          <aside
            className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:w-72"
            aria-label="Filtros de búsqueda"
          >
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filtros
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Busca y filtra el listado de usuarios.
            </p>
            <UserFilters
              search={search}
              setSearch={setSearch}
              city={city}
              setCity={setCity}
              country={country}
              setCountry={setCountry}
              company={company}
              setCompany={setCompany}
              filters={filters}
              onClear={clearFilters}
            />
          </aside>

          {/* Listado de usuarios */}
          <section className="min-w-0 flex-1" aria-label="Listado de usuarios">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Listado
              </h2>
              {!loading && (
                <p className="text-sm text-slate-600">
                  {users.length === 0
                    ? 'Sin resultados'
                    : `${users.length} usuario${users.length !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>

            {loading ? (
              <UserListSkeleton />
            ) : users.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {users.map((u) => (
                  <UserCard key={u.id} user={u} onSelect={openDetail} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <UserDetailModal
        user={user}
        onClose={closeDetail}
        onUpdate={handleUpdateUser}
        onDelete={handleDeleteUser}
        loading={detailLoading}
      />

      {/* Modal crear usuario */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Crear usuario</h2>
            <CreateUserForm onSubmit={handleCreateUser} onSuccess={() => setShowForm(false)} />
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-4 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
