import { useState, useEffect } from 'react';
import { metadataApi } from '../services/metadataApi';

export const useTableData = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await metadataApi.getTables(params);
      setTables(result.tables);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    error,
    refetch: fetchTables
  };
};

export const useTableById = (tableId) => {
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tableId) return;

    const fetchTable = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await metadataApi.getTableById(tableId);
        setTable(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching table:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [tableId]);

  return { table, loading, error };
};

export const useColumnData = (tableId) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tableId) return;

    const fetchColumns = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await metadataApi.getColumnsByTableId(tableId);
        setColumns(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching columns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [tableId]);

  return { columns, loading, error };
};