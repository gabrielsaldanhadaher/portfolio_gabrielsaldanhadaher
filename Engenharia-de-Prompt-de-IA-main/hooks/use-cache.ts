import { useRef, useCallback } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live em ms (padrão: 5 minutos)
}

/**
 * Hook para cache simples de dados em memória
 * Útil para evitar requisições repetidas
 */
export function useCache<T>(options?: CacheOptions) {
  const { ttl = 5 * 60 * 1000 } = options ?? {}; // 5 minutos padrão
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());

  const get = useCallback(
    (key: string): T | null => {
      const entry = cacheRef.current.get(key);
      if (!entry) return null;

      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      if (isExpired) {
        cacheRef.current.delete(key);
        return null;
      }

      return entry.data;
    },
    []
  );

  const set = useCallback((key: string, data: T) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }, [ttl]);

  const clear = useCallback((key?: string) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  const has = useCallback((key: string): boolean => {
    return get(key) !== null;
  }, [get]);

  return { get, set, clear, has };
}
