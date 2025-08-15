import { useState, useEffect } from 'react';
import { metadataApi } from '../services/metadataApi';

export const useBusinessOffers = (searchQuery, category = null) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setOffers([]);
      return;
    }

    const searchOffers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await metadataApi.searchBusinessOffers(searchQuery, category);
        setOffers(result);
      } catch (err) {
        setError(err.message);
        console.error('Error searching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timer = setTimeout(searchOffers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, category]);

  return { offers, loading, error };
};