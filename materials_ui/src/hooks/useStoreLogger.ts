import { useEffect } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';

export function useStoreLogger<T>(store: UseBoundStore<StoreApi<T>>) {
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      console.log('Zustand store changed:', state);
    });

    return () => unsubscribe();
  }, []);
}
