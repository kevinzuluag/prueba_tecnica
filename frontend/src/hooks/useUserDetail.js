import { useState, useCallback } from 'react';
import { userApi } from '../services/api';

export function useUserDetail() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openDetail = useCallback(async (id) => {
    if (!id) {
      setUser(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getById(id);
      setUser(data);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return { user, loading, error, openDetail, closeDetail };
}
