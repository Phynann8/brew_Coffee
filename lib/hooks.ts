import { useState, useEffect, useCallback } from 'react';
import * as api from './api';
import type { Product, Store, Order, Staff, Inventory, Review } from './database.types';

// ============================================================================
// Generic Data Hook
// ============================================================================

interface UseDataResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

function useData<T>(
    fetcher: () => Promise<T>,
    deps: unknown[] = []
): UseDataResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refetch: fetch };
}

// ============================================================================
// Product Hooks
// ============================================================================

export function useProducts() {
    return useData<Product[]>(() => api.getProducts(), []);
}

export function useProduct(id: string) {
    return useData<Product | null>(() => api.getProductById(id), [id]);
}

// ============================================================================
// Store Hooks
// ============================================================================

export function useStores() {
    return useData<Store[]>(() => api.getStores(), []);
}

// ============================================================================
// Order Hooks
// ============================================================================

export function useOrders(userId?: string) {
    return useData<Order[]>(() => api.getOrders(userId), [userId]);
}

export function useOrderQueue() {
    return useData(() => api.getOrderQueue(), []);
}

// ============================================================================
// Inventory Hooks
// ============================================================================

export function useInventory(storeId?: string) {
    return useData<Inventory[]>(() => api.getInventory(storeId), [storeId]);
}

// ============================================================================
// Staff Hooks
// ============================================================================

export function useStaff(storeId?: string) {
    return useData<Staff[]>(() => api.getStaff(storeId), [storeId]);
}

// ============================================================================
// Review Hooks
// ============================================================================

export function useReviews() {
    return useData<Review[]>(() => api.getReviews(), []);
}

// ============================================================================
// Analytics Hooks
// ============================================================================

export function useAnalytics() {
    return useData(() => api.getAnalytics(), []);
}

// ============================================================================
// Rewards Hooks
// ============================================================================

export function useRewards() {
    return useData(() => api.getRewards(), []);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateOrder() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.createOrder(order);
            return result;
        } catch (e) {
            const err = e instanceof Error ? e : new Error('Failed to create order');
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createOrder, loading, error };
}

export function useUpdateOrderStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateStatus = async (orderId: string, status: Order['status']) => {
        setLoading(true);
        setError(null);
        try {
            await api.updateOrderStatus(orderId, status);
        } catch (e) {
            const err = e instanceof Error ? e : new Error('Failed to update order');
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
}

export function useUpdateInventory() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateInventory = async (id: string, updates: Partial<Inventory>) => {
        setLoading(true);
        setError(null);
        try {
            await api.updateInventoryItem(id, updates);
        } catch (e) {
            const err = e instanceof Error ? e : new Error('Failed to update inventory');
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateInventory, loading, error };
}
