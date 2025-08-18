import { useState, useEffect } from 'react';
import { metadataApi } from '../services/metadataApi';

export const useDraftState = () => {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await metadataApi.loadDraft();
      setDraft(result);
    } catch (err) {
      setError(err.message);
      console.error('Error loading draft:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (draftData) => {
    setSaving(true);
    setError(null);
    
    try {
      const result = await metadataApi.saveDraft(draftData);
      setDraft({
        id: result.draftId,
        data: draftData,
        savedAt: result.savedAt
      });
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error saving draft:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteDraft = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await metadataApi.deleteDraft();
      setDraft(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting draft:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasDraft = draft !== null;
  const draftAge = draft ? new Date() - new Date(draft.savedAt) : 0;

  return {
    draft,
    loading,
    saving,
    error,
    hasDraft,
    draftAge,
    saveDraft,
    deleteDraft,
    loadDraft
  };
};