"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs once on the client to get the initial value from localStorage.
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        setValue(initialValue);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [key, initialValue]);

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    if (typeof window !== 'undefined') {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, value]);
  
  useEffect(() => {
    if (isInitialized) {
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(`Error setting localStorage key “${key}”:`, error);
            }
        }
    }
  }, [key, value, isInitialized]);


  return [value, setStoredValue] as const;
}

export default useLocalStorage;
