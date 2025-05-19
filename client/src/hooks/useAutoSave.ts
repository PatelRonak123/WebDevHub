import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type AutoSaveFunction<T> = (data: T) => Promise<any>;

interface UseAutoSaveOptions {
  delay?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave<T>(
  data: T,
  saveFunction: AutoSaveFunction<T>,
  options: UseAutoSaveOptions = {}
) {
  const { delay = 5000, onSuccess, onError } = options;
  const { toast } = useToast();
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  
  // Function to save data
  const saveData = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await saveFunction(data);
      const now = new Date();
      setLastSaved(now);
      
      // Show toast on successful save
      toast({
        title: "Auto-saved",
        description: "Your changes have been automatically saved as draft",
        variant: "success",
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to save");
      setError(error);
      
      // Show error toast
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
      
      if (onError) onError(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to manually trigger a save
  const save = async () => {
    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    await saveData();
  };
  
  // Auto-save effect triggered by data changes
  useEffect(() => {
    // Skip first render or when data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }
    
    // Update previous data
    previousDataRef.current = data;
    
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(saveData, delay);
    
    // Cleanup on unmount or before next effect
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay]);
  
  return {
    lastSaved,
    isSaving,
    error,
    save, // For manual saving
  };
}
