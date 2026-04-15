"use client";

import { useState, useEffect, useCallback } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): [ApiState<T>, () => Promise<void>, (data: Partial<T>) => void] {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [url, onSuccess, onError]);

  const setData = useCallback((newData: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: prev.data ? { ...prev.data, ...newData } : (newData as T),
    }));
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return [state, fetchData, setData];
}

// Hook for paginated data
export function usePaginatedApi<T>(
  url: string,
  options: {
    pageSize?: number;
    filters?: Record<string, string>;
  } = {}
) {
  const { pageSize = 20, filters = {} } = options;

  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          ...filters,
        });

        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();

        setData(result.items || result.users || result.providers || result.data || []);
        setPagination({
          page: result.pagination?.page || page,
          totalPages: result.pagination?.pages || result.pagination?.totalPages || 1,
          total: result.pagination?.total || 0,
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [url, pageSize, filters]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchData(page);
      }
    },
    [fetchData, pagination.totalPages]
  );

  const refresh = useCallback(() => {
    fetchData(pagination.page);
  }, [fetchData, pagination.page]);

  return {
    data,
    pagination,
    loading,
    error,
    goToPage,
    refresh,
  };
}

// Hook for admin stats
export function useAdminStats() {
  return useApi<{
    users: { total: number; active: number; newThisMonth: number; growth: number };
    providers: { total: number; active: number; pendingKyc: number };
    reservations: {
      total: number;
      completed: number;
      pending: number;
      thisMonth: number;
      growth: number;
    };
    revenue: { total: number; monthly: number; growth: number };
    moderation: { pendingKyc: number; pendingReviews: number; fraudAlerts: number };
    topServices: Array<{ id: string; name: string; reservationCount: number }>;
    recentActivity: Array<any>;
  }>("/api/admin/stats");
}

// Hook for admin users
export function useAdminUsers(filters: {
  search?: string;
  status?: string;
  city?: string;
}) {
  const filterString = new URLSearchParams(
    Object.entries(filters).filter(([_, v]) => v) as [string, string][]
  ).toString();

  return usePaginatedApi<any>(`/api/admin/users${filterString ? `?${filterString}` : ""}`);
}

// Hook for admin providers
export function useAdminProviders(filters: {
  search?: string;
  status?: string;
  kycStatus?: string;
  tier?: string;
}) {
  const filterString = new URLSearchParams(
    Object.entries(filters).filter(([_, v]) => v) as [string, string][]
  ).toString();

  return usePaginatedApi<any>(`/api/admin/providers${filterString ? `?${filterString}` : ""}`);
}
