import { useState, useEffect } from 'react';
import { metadataApi } from '../services/metadataApi';

export const useCustomMetadata = (assetType) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await metadataApi.getCustomMetadataGroups(assetType);
        setGroups(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching custom metadata groups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [assetType]);

  return { groups, loading, error };
};

export const useEnumValues = (enumName) => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enumName) return;

    const fetchValues = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await metadataApi.getEnumValues(enumName);
        setValues(result.values);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching enum values:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, [enumName]);

  return { values, loading, error };
};