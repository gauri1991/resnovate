import { useEffect, useRef, useState, useCallback } from 'react';
import { UseFormWatch } from 'react-hook-form';

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

interface UseAutosaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveNow: () => Promise<void>;
}

/**
 * Hook for automatically saving form data at regular intervals
 *
 * @example
 * const { isSaving, lastSaved, saveNow } = useAutosave({
 *   data: watch(), // from react-hook-form
 *   onSave: async (data) => {
 *     await api.patch(`/posts/${id}`, data);
 *   },
 *   interval: 30000, // 30 seconds
 *   enabled: true,
 * });
 */
export function useAutosave<T>({
  data,
  onSave,
  interval = 30000, // 30 seconds default
  enabled = true,
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const dataRef = useRef<T>(data);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update data ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const saveNow = useCallback(async () => {
    if (!enabled || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(dataRef.current);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
      // Don't throw - autosave failures should be silent
    } finally {
      setIsSaving(false);
    }
  }, [enabled, isSaving, onSave]);

  // Setup autosave interval
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule next autosave
    timeoutRef.current = setTimeout(() => {
      saveNow();
    }, interval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, interval, saveNow]);

  // Save on component unmount (user navigating away)
  useEffect(() => {
    return () => {
      if (enabled && !isSaving) {
        // Fire and forget - don't wait for save to complete
        onSave(dataRef.current).catch(err => {
          console.error('Final save on unmount failed:', err);
        });
      }
    };
  }, [enabled, isSaving, onSave]);

  return {
    isSaving,
    lastSaved,
    saveNow,
  };
}
