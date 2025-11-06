// src/hooks/api/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, config);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const post = useCallback(async (url, data, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get,
    post,
    // Add other HTTP methods as needed (put, delete, etc.)
  };
};

export { useApi };
