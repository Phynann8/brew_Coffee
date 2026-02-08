import { supabase, isSupabaseConfigured } from './supabase';
import { PRODUCTS, STORES, INVENTORY, STAFF, REVIEWS, PAST_ORDERS, ORDER_QUEUE, ANALYTICS_DATA, REWARDS } from '../constants';
import type { Product, Store, Order, Staff, Inventory, Review } from './database.types';

// ============================================================================
// PRODUCTS API
// ============================================================================

export async function getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
        // Return mock data with adapted types
        return PRODUCTS.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image_url: p.image,
            category: p.category,
            is_available: true,
            is_popular: p.isPopular ?? false,
            created_at: new Date().toISOString(),
        }));
    }

    const { data, error } = await supabase!
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('is_popular', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) return null;
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image_url: product.image,
            category: product.category,
            is_available: true,
            is_popular: product.isPopular ?? false,
            created_at: new Date().toISOString(),
        };
    }

    const { data, error } = await supabase!
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ============================================================================
// STORES API
// ============================================================================

export async function getStores(): Promise<Store[]> {
    if (!isSupabaseConfigured()) {
        return STORES.map(s => ({
            id: s.id,
            name: s.name,
            address: s.address,
            distance: s.distance,
            rating: s.rating,
            is_open: s.isOpen,
            closing_time: s.closingTime,
            busy_level: s.busyLevel,
            image_url: s.image,
            has_drive_thru: s.hasDriveThru ?? false,
            has_mobile_order: s.hasMobileOrder ?? false,
            created_at: new Date().toISOString(),
        }));
    }

    const { data, error } = await supabase!
        .from('stores')
        .select('*')
        .order('distance');

    if (error) throw error;
    return data || [];
}

// ============================================================================
// ORDERS API
// ============================================================================

export async function getOrders(userId?: string): Promise<Order[]> {
    if (!isSupabaseConfigured()) {
        return PAST_ORDERS.map(o => ({
            id: o.id,
            user_id: 'mock-user',
            store_id: '1',
            status: o.status,
            total: o.total,
            created_at: new Date().toISOString(),
        }));
    }

    let query = supabase!.from('orders').select('*');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    if (!isSupabaseConfigured()) {
        // Mock order creation
        return {
            ...order,
            id: `mock-${Date.now()}`,
            created_at: new Date().toISOString(),
        };
    }

    const { data, error } = await supabase!
        .from('orders')
        .insert(order)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    if (!isSupabaseConfigured()) {
        console.log(`[Mock] Order ${orderId} status updated to ${status}`);
        return;
    }

    const { error } = await supabase!
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) throw error;
}

// ============================================================================
// ADMIN: ORDER QUEUE (Real-time capable)
// ============================================================================

export async function getOrderQueue() {
    if (!isSupabaseConfigured()) {
        return ORDER_QUEUE;
    }

    const { data, error } = await supabase!
        .from('orders')
        .select(`
      *,
      order_items (
        *,
        product:products (name)
      ),
      user:users (full_name, avatar_url)
    `)
        .in('status', ['Pending', 'Preparing', 'Ready'])
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// ============================================================================
// INVENTORY API
// ============================================================================

export async function getInventory(storeId?: string): Promise<Inventory[]> {
    if (!isSupabaseConfigured()) {
        return INVENTORY.map(i => ({
            id: i.id,
            store_id: '1',
            name: i.name,
            category: i.category,
            quantity: i.quantity,
            percentage: i.percentage,
            status: i.status,
            image_url: i.image,
            created_at: new Date().toISOString(),
        }));
    }

    let query = supabase!.from('inventory').select('*');

    if (storeId) {
        query = query.eq('store_id', storeId);
    }

    const { data, error } = await query.order('percentage', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function updateInventoryItem(id: string, updates: Partial<Inventory>): Promise<void> {
    if (!isSupabaseConfigured()) {
        console.log(`[Mock] Inventory ${id} updated:`, updates);
        return;
    }

    const { error } = await supabase!
        .from('inventory')
        .update(updates)
        .eq('id', id);

    if (error) throw error;
}

// ============================================================================
// STAFF API
// ============================================================================

export async function getStaff(storeId?: string): Promise<Staff[]> {
    if (!isSupabaseConfigured()) {
        return STAFF.map(s => ({
            id: s.id,
            store_id: '1',
            name: s.name,
            role: s.role,
            status: s.status,
            image_url: s.image,
            shift: s.shift,
            created_at: new Date().toISOString(),
        }));
    }

    let query = supabase!.from('staff').select('*');

    if (storeId) {
        query = query.eq('store_id', storeId);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data || [];
}

// ============================================================================
// REVIEWS API
// ============================================================================

export async function getReviews(): Promise<Review[]> {
    if (!isSupabaseConfigured()) {
        return REVIEWS.map(r => ({
            id: r.id,
            user_id: 'mock-user',
            product_id: '1',
            rating: r.rating,
            review_text: r.reviewText,
            is_replied: r.isReplied,
            created_at: new Date().toISOString(),
        }));
    }

    const { data, error } = await supabase!
        .from('reviews')
        .select(`
      *,
      user:users (full_name, avatar_url),
      product:products (name)
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// ============================================================================
// ANALYTICS API
// ============================================================================

export async function getAnalytics() {
    if (!isSupabaseConfigured()) {
        return ANALYTICS_DATA;
    }

    // In a real app, this would aggregate data from orders, products, users
    // For now, we'll return mock data even with Supabase until we have real data
    return ANALYTICS_DATA;
}

// ============================================================================
// REWARDS API
// ============================================================================

export async function getRewards() {
    if (!isSupabaseConfigured()) {
        return REWARDS;
    }

    // Rewards could be a separate table or static config
    return REWARDS;
}
