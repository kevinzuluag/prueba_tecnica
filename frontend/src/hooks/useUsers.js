import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';
import { useDebounce } from './useDebounce';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ cities: [], countries: [], companies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (city) params.city = city;
      if (country) params.country = country;
      if (company) params.company = company;
      const data = await userApi.getAll(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, city, country, company]);

  const fetchFilters = useCallback(async () => {
    try {
      const data = await userApi.getFilters();
      setFilters({
        cities: data.cities || [],
        countries: data.countries || [],
        companies: data.companies || [],
      });
    } catch {
      setFilters({ cities: [], countries: [], companies: [] });
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const createUser = useCallback(async (userData) => {
    const created = await userApi.create(userData);
    setUsers((prev) => [created, ...prev]);
    await fetchFilters();
    return created;
  }, [fetchFilters]);

  const updateUser = useCallback(async (id, userData) => {
    const updated = await userApi.update(id, userData);
    setUsers((prev) => prev.map((u) => (u.id === String(id) ? updated : u)));
    await fetchFilters();
    return updated;
  }, []);

  const deleteUser = useCallback(async (id) => {
    await userApi.delete(id);
    setUsers((prev) => prev.filter((u) => u.id !== String(id)));
    await fetchFilters();
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCity('');
    setCountry('');
    setCompany('');
  }, []);

  return {
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
    refetch: fetchUsers,
    clearFilters,
  };
}
