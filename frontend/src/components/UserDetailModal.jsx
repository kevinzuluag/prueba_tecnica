import { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Globe, Building2, Trash2, Pencil } from 'lucide-react';
import { CreateUserForm } from './CreateUserForm';

export function UserDetailModal({ user, onClose, onDelete, onUpdate, loading }) {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
  }, [user?.id]);

  if (!user && !loading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del usuario"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          </div>
        ) : user ? (
          <>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            {editing ? (
              <div className="pr-8">
                <h2 className="mb-4 text-lg font-semibold text-slate-800">Editar usuario</h2>
                <CreateUserForm
                  key={user.id}
                  initialValues={{
                    name: user.name,
                    email: user.email,
                    phone: user.phone ?? '',
                    city: user.city ?? '',
                    country: user.country ?? '',
                    company: user.company ?? '',
                  }}
                  submitLabel="Guardar cambios"
                  onSubmit={async (formData) => {
                    await onUpdate(user.id, formData);
                    setEditing(false);
                  }}
                  onSuccess={() => setEditing(false)}
                />
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                    {user.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
                    <p className="text-sm text-slate-500">ID: {user.id}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-slate-600">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <a href={`mailto:${user.email}`} className="hover:text-indigo-600">
                      {user.email}
                    </a>
                  </li>
                  {user.phone && (
                    <li className="flex items-center gap-3 text-slate-600">
                      <Phone className="h-5 w-5 text-slate-400" />
                      {user.phone}
                    </li>
                  )}
                  {user.city && (
                    <li className="flex items-center gap-3 text-slate-600">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      {user.city}
                    </li>
                  )}
                  {user.country && (
                    <li className="flex items-center gap-3 text-slate-600">
                      <Globe className="h-5 w-5 text-slate-400" />
                      {user.country}
                    </li>
                  )}
                  {user.company && (
                    <li className="flex items-center gap-3 text-slate-600">
                      <Building2 className="h-5 w-5 text-slate-400" />
                      {user.company}
                    </li>
                  )}
                </ul>
                {onUpdate && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar usuario
                    </button>
                  </div>
                )}
                {onDelete && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm('¿Eliminar este usuario?')) return;
                        setDeleting(true);
                        try {
                          await onDelete(user.id);
                          onClose();
                        } finally {
                          setDeleting(false);
                        }
                      }}
                      disabled={deleting}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleting ? 'Eliminando...' : 'Eliminar usuario'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
