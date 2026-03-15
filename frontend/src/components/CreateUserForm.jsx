import { useState, useEffect, useRef } from 'react';
import { UserPlus, Loader2, Save, ChevronDown, Search } from 'lucide-react';
import { COUNTRY_CODES, parsePhone, formatPhoneNumber, getMaxDigits } from '../utils/countryCodes';

const initialForm = { name: '', email: '', phone: '', city: '', country: '', company: '' };

function validate(form, phoneCode, phoneNumberDigits) {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'El nombre es requerido';
  if (!form.email?.trim()) errors.email = 'El email es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email no válido';
  const len = (phoneNumberDigits || '').replace(/\D/g, '').length;
  if (len > 0) {
    const country = COUNTRY_CODES.find((c) => c.code === phoneCode);
    const required = getMaxDigits(country?.pattern);
    if (len !== required) {
      errors.phone = `El número debe tener ${required} dígitos para este país.`;
    }
  }
  return errors;
}

export function CreateUserForm({ onSubmit, onSuccess, initialValues, submitLabel }) {
  const [form, setForm] = useState(initialValues ? { ...initialForm, ...initialValues } : initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [phoneCode, setPhoneCode] = useState(COUNTRY_CODES[0].code);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);
  const isEdit = Boolean(initialValues);

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...initialForm, ...initialValues }));
      const { code, number } = parsePhone(initialValues.phone);
      const country = COUNTRY_CODES.find((c) => c.code === code);
      const max = getMaxDigits(country?.pattern);
      setPhoneCode(code);
      setPhoneNumber(number.replace(/\s/g, '').slice(0, max));
    }
  }, [initialValues?.id]);

  useEffect(() => {
    if (!initialValues?.phone) return;
    const { code, number } = parsePhone(initialValues.phone);
    const country = COUNTRY_CODES.find((c) => c.code === code);
    const max = getMaxDigits(country?.pattern);
    setPhoneCode(code);
    setPhoneNumber(number.replace(/\s/g, '').slice(0, max));
  }, [initialValues?.phone]);

  useEffect(() => {
    if (!countryOpen) return;
    const close = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [countryOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const filteredCountries = countrySearch.trim()
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch) ||
          c.search.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : COUNTRY_CODES;

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === phoneCode) || COUNTRY_CODES[0];

  const buildPhone = (code, digits) => {
    const d = (digits || '').replace(/\D/g, '');
    if (!d) return code;
    const country = COUNTRY_CODES.find((c) => c.code === code);
    const formatted = formatPhoneNumber(d, country?.pattern);
    return `${code} ${formatted}`.trim();
  };

  const maxDigits = getMaxDigits(selectedCountry?.pattern);

  const handlePhoneNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, maxDigits);
    setPhoneNumber(raw);
    setForm((prev) => ({ ...prev, phone: buildPhone(phoneCode, raw) }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
  };

  const handleCountrySelect = (code) => {
    const country = COUNTRY_CODES.find((c) => c.code === code);
    const newMax = getMaxDigits(country?.pattern);
    const trimmed = phoneNumber.slice(0, newMax);
    setPhoneCode(code);
    setPhoneNumber(trimmed);
    setForm((prev) => ({ ...prev, phone: buildPhone(code, trimmed) }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
    setCountryOpen(false);
    setCountrySearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form, phoneCode, phoneNumber);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (!isEdit) {
        setForm(initialForm);
        setPhoneCode(COUNTRY_CODES[0].code);
        setPhoneNumber('');
      }
      setErrors({});
      onSuccess?.();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Ej. Juan Pérez"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="juan@ejemplo.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
        <div className="flex gap-2">
          <div className="relative shrink-0" ref={countryRef}>
            <button
              type="button"
              onClick={() => setCountryOpen((o) => !o)}
              className="flex min-w-[100px] items-center justify-between gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>{selectedCountry.code}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {countryOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-56 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-100 p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Buscar país..."
                      className="w-full rounded border border-slate-200 py-1.5 pl-8 pr-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
                <ul className="max-h-44 overflow-y-auto py-1">
                  {filteredCountries.map((c) => (
                    <li key={`${c.code}-${c.name}`}>
                      <button
                        type="button"
                        onClick={() => handleCountrySelect(c.code)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                          c.code === phoneCode ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-medium">{c.code}</span>
                        <span className="ml-2">{c.name}</span>
                      </button>
                    </li>
                  ))}
                  {filteredCountries.length === 0 && (
                    <li className="px-3 py-4 text-center text-sm text-slate-500">
                      No se encontró el país
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <input
            type="tel"
            inputMode="numeric"
            value={formatPhoneNumber(phoneNumber, selectedCountry?.pattern)}
            onChange={handlePhoneNumberChange}
            placeholder="ej. 809 123 4567"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Selecciona el país y escribe el número; se formateará con espacios automáticamente.
        </p>
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Ciudad</label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Madrid"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">País</label>
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="República Dominicana"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Empresa</label>
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Mi Empresa"
        />
      </div>
      {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEdit ? (
          <Save className="h-4 w-4" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {submitting ? (isEdit ? 'Guardando...' : 'Creando...') : submitLabel || 'Crear usuario'}
      </button>
    </form>
  );
}
