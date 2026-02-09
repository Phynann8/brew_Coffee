import { supabase, isSupabaseConfigured } from './supabase';
import { PRODUCTS, STORES, INVENTORY, STAFF, REVIEWS, PAST_ORDERS, ORDER_QUEUE, ANALYTICS_DATA, REWARDS, IMAGES } from '../constants';
import type { Product as DbProduct, Store as DbStore, Order as DbOrder, Staff as DbStaff, Inventory as DbInventory, Review as DbReview } from './database.types';
import type { AnalyticsData, Campaign, CartItem, CustomerReview, NotificationAudience, NotificationHistoryItem, OrderQueueItem, Product as UiProduct, QueueAction, StaffPerformance } from '../types';

const MOCK_USER_ID = 'mock-user';
const MOCK_STORE_ID = 'mock-store';
const AUDIENCE_COUNTS: Record<NotificationAudience, number> = { all: 1240, loyal: 420, inactive: 265, new: 138 };

const nowIso = () => new Date().toISOString();
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const randomId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

const toUiProduct = (product: DbProduct): UiProduct => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image_url,
    category: product.category,
    isPopular: product.is_popular,
});

const toDbProduct = (product: UiProduct): DbProduct => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image_url: product.image,
    category: product.category,
    is_available: true,
    is_popular: Boolean(product.isPopular),
    created_at: nowIso(),
});

const toDbStore = (store: (typeof STORES)[number]): DbStore => ({
    id: store.id,
    name: store.name,
    address: store.address,
    distance: store.distance,
    rating: store.rating,
    is_open: store.isOpen,
    closing_time: store.closingTime,
    busy_level: store.busyLevel,
    image_url: store.image,
    has_drive_thru: Boolean(store.hasDriveThru),
    has_mobile_order: Boolean(store.hasMobileOrder),
    created_at: nowIso(),
});

const toDbInventory = (item: (typeof INVENTORY)[number]): DbInventory => ({
    id: item.id,
    store_id: MOCK_STORE_ID,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    percentage: item.percentage,
    status: item.status,
    image_url: item.image,
    created_at: nowIso(),
});

const toDbStaff = (member: (typeof STAFF)[number]): DbStaff => ({
    id: member.id,
    store_id: MOCK_STORE_ID,
    name: member.name,
    role: member.role,
    status: member.status,
    image_url: member.image,
    shift: member.shift,
    created_at: nowIso(),
});

const toDbReview = (review: CustomerReview): DbReview => ({
    id: review.id,
    user_id: MOCK_USER_ID,
    product_id: 'mock-product',
    rating: review.rating,
    review_text: review.reviewText,
    is_replied: review.isReplied,
    created_at: nowIso(),
});

const formatTimer = (createdAt: string) => {
    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    return `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
};

const formatTimeAgo = (dateIso: string) => {
    const mins = Math.floor((Date.now() - new Date(dateIso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const orderStatusToQueueStatus = (status: DbOrder['status'], createdAt: string): OrderQueueItem['status'] => {
    if (status === 'Preparing') return 'Brewing';
    if (status === 'Ready') return 'Ready';
    if (status === 'Pending') return ((Date.now() - new Date(createdAt).getTime()) / 60000) >= 10 ? 'Critical' : 'New';
    return 'Ready';
};

const queueActionToOrderStatus = (action: QueueAction): DbOrder['status'] => {
    if (action === 'start-brewing') return 'Preparing';
    if (action === 'mark-ready') return 'Ready';
    if (action === 'complete-order') return 'Completed';
    if (action === 'cancel-order') return 'Canceled';
    return 'Pending';
};

async function withSupabaseFallback<T>(supabaseFetcher: () => Promise<T>, fallbackFetcher: () => Promise<T> | T): Promise<T> {
    if (!isSupabaseConfigured()) return await fallbackFetcher();
    try {
        return await supabaseFetcher();
    } catch (error) {
        console.warn('[BrewCoffee API] falling back to mock data:', error);
        return await fallbackFetcher();
    }
}

const mockProducts: UiProduct[] = PRODUCTS.map((product) => ({ ...product }));
const mockStores = STORES.map((store) => ({ ...store }));
const mockInventory = INVENTORY.map((item) => ({ ...item }));
const mockStaff = STAFF.map((member) => ({ ...member }));
const mockReviews: CustomerReview[] = REVIEWS.map((review) => ({ ...review, replyText: review.isReplied ? 'Thanks for your feedback. We have shared this with our team.' : undefined }));
const mockQueue: OrderQueueItem[] = ORDER_QUEUE.map((order) => ({ ...order, items: order.items.map((item) => ({ ...item })), customizations: [...order.customizations] }));
const mockOrders: DbOrder[] = PAST_ORDERS.map((order, index) => ({ id: order.id, user_id: MOCK_USER_ID, store_id: MOCK_STORE_ID, status: index === 0 ? 'Pending' : 'Completed', total: order.total, created_at: new Date(Date.now() - index * 3 * 60 * 60 * 1000).toISOString() }));
const mockCampaigns: Campaign[] = [
    { id: randomId('campaign'), name: 'Summer Espresso Deal', offerType: 'percent', discountValue: 25, minPurchase: 10, startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), targetAudience: 'loyal', status: 'Draft' },
    { id: randomId('campaign'), name: 'Weekend BOGO Latte', offerType: 'bogo', discountValue: 0, minPurchase: 0, startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), targetAudience: 'all', status: 'Active' },
];
const mockNotificationHistory: NotificationHistoryItem[] = [
    { id: randomId('notification'), title: 'Morning Brew Reminder', message: 'Order before 9 AM and get free extra shot.', audience: 'all', delivery: 'now', status: 'Sent', targetCount: AUDIENCE_COUNTS.all, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { id: randomId('notification'), title: 'Welcome Offer', message: 'Get 15% off your first order this week.', audience: 'new', delivery: 'scheduled', status: 'Scheduled', targetCount: AUDIENCE_COUNTS.new, scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
];

const buildTopSellersFromMockQueue = (): AnalyticsData['topSellers'] => {
    const counts = new Map<string, number>();
    for (const order of mockQueue) for (const item of order.items) counts.set(item.name, (counts.get(item.name) ?? 0) + item.quantity);
    for (const order of PAST_ORDERS) for (const rawItem of order.items) {
        const productName = rawItem.split('(')[0].trim();
        counts.set(productName, (counts.get(productName) ?? 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    const max = sorted[0]?.[1] ?? 1;
    return sorted.map(([name, count]) => ({ name, count, percentage: Math.max(10, Math.round((count / max) * 100)) }));
};

const buildMockAnalytics = (): AnalyticsData => {
    const completedAndReadyOrders = mockOrders.filter((order) => ['Ready', 'Completed'].includes(order.status));
    const topSellers = buildTopSellersFromMockQueue();
    return {
        ...ANALYTICS_DATA,
        totalOrders: mockOrders.length,
        revenue: Math.round(completedAndReadyOrders.reduce((sum, order) => sum + Number(order.total), 0)),
        topSellers: topSellers.length ? topSellers : ANALYTICS_DATA.topSellers,
        activeMembers: Math.max(ANALYTICS_DATA.activeMembers, mockReviews.length * 10),
    };
};

const buildStaffPerformance = (staffRows: DbStaff[]): StaffPerformance[] => staffRows.map((member, index) => {
    const prepMinutes = 3 + (index % 3);
    const prepSeconds = 10 + ((index * 11) % 45);
    return {
        id: member.id,
        name: member.name,
        role: member.role,
        status: member.status,
        image: member.image_url,
        shift: member.shift,
        ordersCompleted: 84 + (index * 26),
        rating: Number((4.2 + ((index + 1) * 0.13)).toFixed(1)),
        avgPrepTime: `${prepMinutes}m ${String(prepSeconds).padStart(2, '0')}s`,
        salesGenerated: 1260 + (index * 540),
    };
}).sort((a, b) => b.salesGenerated - a.salesGenerated);

export async function getProducts(): Promise<DbProduct[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await supabase!
                .from('products')
                .select('*')
                .eq('is_available', true)
                .order('is_popular', { ascending: false });
            if (error) throw error;
            return data ?? [];
        },
        () => mockProducts.map(toDbProduct)
    );
}

export async function getProductById(id: string): Promise<DbProduct | null> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await supabase!
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },
        () => {
            const product = mockProducts.find((item) => item.id === id);
            return product ? toDbProduct(product) : null;
        }
    );
}

export async function getMenuProducts(): Promise<UiProduct[]> {
    const products = await getProducts();
    return products.map(toUiProduct);
}

export async function createMenuItem(item: Omit<UiProduct, 'id'> & { id?: string }): Promise<UiProduct> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await supabase!
                .from('products')
                .insert({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image_url: item.image,
                    category: item.category,
                    is_available: true,
                    is_popular: Boolean(item.isPopular),
                })
                .select('*')
                .single();
            if (error) throw error;
            return toUiProduct(data);
        },
        () => {
            const created: UiProduct = {
                id: item.id ?? randomId('product'),
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                category: item.category,
                isPopular: Boolean(item.isPopular),
            };
            mockProducts.unshift(created);
            return clone(created);
        }
    );
}

export async function updateMenuItem(id: string, updates: Partial<Omit<UiProduct, 'id'>>): Promise<UiProduct> {
    return withSupabaseFallback(
        async () => {
            const payload: Record<string, unknown> = {};
            if (updates.name !== undefined) payload.name = updates.name;
            if (updates.description !== undefined) payload.description = updates.description;
            if (updates.price !== undefined) payload.price = updates.price;
            if (updates.image !== undefined) payload.image_url = updates.image;
            if (updates.category !== undefined) payload.category = updates.category;
            if (updates.isPopular !== undefined) payload.is_popular = updates.isPopular;

            const { data, error } = await supabase!
                .from('products')
                .update(payload)
                .eq('id', id)
                .select('*')
                .single();
            if (error) throw error;
            return toUiProduct(data);
        },
        () => {
            const index = mockProducts.findIndex((product) => product.id === id);
            if (index < 0) throw new Error('Menu item not found');
            mockProducts[index] = { ...mockProducts[index], ...updates };
            return clone(mockProducts[index]);
        }
    );
}

export async function deleteMenuItem(id: string): Promise<void> {
    await withSupabaseFallback(
        async () => {
            const { error } = await supabase!.from('products').delete().eq('id', id);
            if (error) throw error;
        },
        () => {
            const index = mockProducts.findIndex((product) => product.id === id);
            if (index >= 0) mockProducts.splice(index, 1);
        }
    );
}

export async function getStores(): Promise<DbStore[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await supabase!.from('stores').select('*').order('distance');
            if (error) throw error;
            return data ?? [];
        },
        () => mockStores.map(toDbStore)
    );
}

export async function getOrders(userId?: string): Promise<DbOrder[]> {
    return withSupabaseFallback(
        async () => {
            let query = supabase!.from('orders').select('*');
            if (userId) query = query.eq('user_id', userId);
            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data ?? [];
        },
        () => (userId ? clone(mockOrders.filter((order) => order.user_id === userId)) : clone(mockOrders))
    );
}

export async function createOrder(order: Omit<DbOrder, 'id' | 'created_at'>): Promise<DbOrder> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await supabase!.from('orders').insert(order).select('*').single();
            if (error) throw error;
            return data;
        },
        () => {
            const created: DbOrder = { ...order, id: randomId('order'), created_at: nowIso() };
            mockOrders.unshift(created);
            return clone(created);
        }
    );
}

export async function createOrderFromCart(
    cartItems: CartItem[],
    options?: { userId?: string; storeId?: string; customerName?: string }
): Promise<string> {
    if (!cartItems.length) throw new Error('Cannot create an order with an empty cart');

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const customerName = options?.customerName ?? 'Guest';

    const order = await createOrder({
        user_id: options?.userId ?? MOCK_USER_ID,
        store_id: options?.storeId ?? MOCK_STORE_ID,
        status: 'Pending',
        total,
    });

    await withSupabaseFallback(
        async () => {
            const orderItemsPayload = cartItems.map((item) => ({
                order_id: order.id,
                product_id: item.product.id,
                quantity: item.quantity,
                size: item.size,
                customizations: item.customizations,
            }));
            const { error } = await supabase!.from('order_items').insert(orderItemsPayload as any);
            if (error) throw error;
        },
        () => {
            const queueItem: OrderQueueItem = {
                id: order.id,
                customerName,
                orderNumber: String(300 + mockQueue.length + 1),
                items: cartItems.map((item) => ({ name: item.product.name, quantity: item.quantity })),
                customizations: cartItems.flatMap((item) => item.customizations),
                status: 'New',
                timer: '00:00',
                image: cartItems[0]?.product.image ?? IMAGES.cappuccino,
            };
            mockQueue.unshift(queueItem);
        }
    );

    return order.id;
}

export async function updateOrderStatus(orderId: string, status: DbOrder['status']): Promise<void> {
    await withSupabaseFallback(
        async () => {
            const { error } = await supabase!.from('orders').update({ status }).eq('id', orderId);
            if (error) throw error;
        },
        () => {
            const order = mockOrders.find((entry) => entry.id === orderId);
            if (order) order.status = status;
        }
    );
}

export async function getOrderQueue(): Promise<OrderQueueItem[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await (supabase as any)
                .from('orders')
                .select(`
                    id,
                    status,
                    created_at,
                    order_items (
                        quantity,
                        customizations,
                        product:products (name, image_url)
                    ),
                    user:users (full_name)
                `)
                .in('status', ['Pending', 'Preparing', 'Ready'])
                .order('created_at', { ascending: true });

            if (error) throw error;

            return (data ?? []).map((order: any, index: number) => {
                const items = (order.order_items ?? []).map((item: any) => ({
                    name: item.product?.name ?? 'Coffee',
                    quantity: item.quantity ?? 1,
                }));

                const customizations = (order.order_items ?? []).flatMap((item: any) =>
                    Array.isArray(item.customizations) ? item.customizations : []
                );

                return {
                    id: order.id,
                    customerName: order.user?.full_name ?? 'Guest Customer',
                    orderNumber: String(300 + index + 1),
                    items,
                    customizations,
                    status: orderStatusToQueueStatus(order.status, order.created_at),
                    timer: formatTimer(order.created_at),
                    image: order.order_items?.[0]?.product?.image_url ?? IMAGES.cappuccino,
                } satisfies OrderQueueItem;
            });
        },
        () => clone(mockQueue.map((item, index) => ({ ...item, orderNumber: item.orderNumber || String(300 + index + 1) })))
    );
}

export async function transitionQueueOrder(orderId: string, action: QueueAction): Promise<void> {
    const nextOrderStatus = queueActionToOrderStatus(action);

    await withSupabaseFallback(
        async () => {
            const { error } = await supabase!.from('orders').update({ status: nextOrderStatus }).eq('id', orderId);
            if (error) throw error;
        },
        () => {
            const queueIndex = mockQueue.findIndex((order) => order.id === orderId);
            if (queueIndex >= 0) {
                if (action === 'complete-order' || action === 'cancel-order') {
                    mockQueue.splice(queueIndex, 1);
                } else if (action === 'start-brewing') {
                    mockQueue[queueIndex].status = 'Brewing';
                } else if (action === 'mark-ready') {
                    mockQueue[queueIndex].status = 'Ready';
                }
            }

            const order = mockOrders.find((entry) => entry.id === orderId);
            if (order) order.status = nextOrderStatus;
        }
    );
}

export async function getInventory(storeId?: string): Promise<DbInventory[]> {
    return withSupabaseFallback(
        async () => {
            let query = supabase!.from('inventory').select('*');
            if (storeId) query = query.eq('store_id', storeId);
            const { data, error } = await query.order('percentage', { ascending: true });
            if (error) throw error;
            return data ?? [];
        },
        () => mockInventory.map(toDbInventory)
    );
}

export async function updateInventoryItem(id: string, updates: Partial<DbInventory>): Promise<void> {
    await withSupabaseFallback(
        async () => {
            const { error } = await supabase!.from('inventory').update(updates).eq('id', id);
            if (error) throw error;
        },
        () => {
            const index = mockInventory.findIndex((item) => item.id === id);
            if (index >= 0) {
                mockInventory[index] = {
                    ...mockInventory[index],
                    name: updates.name ?? mockInventory[index].name,
                    category: updates.category ?? mockInventory[index].category,
                    quantity: updates.quantity ?? mockInventory[index].quantity,
                    percentage: updates.percentage ?? mockInventory[index].percentage,
                    status: (updates.status as (typeof INVENTORY)[number]['status']) ?? mockInventory[index].status,
                    image: updates.image_url ?? mockInventory[index].image,
                };
            }
        }
    );
}

export async function getStaff(storeId?: string): Promise<DbStaff[]> {
    return withSupabaseFallback(
        async () => {
            let query = supabase!.from('staff').select('*');
            if (storeId) query = query.eq('store_id', storeId);
            const { data, error } = await query.order('name');
            if (error) throw error;
            return data ?? [];
        },
        () => mockStaff.map(toDbStaff)
    );
}

export async function getStaffPerformance(): Promise<StaffPerformance[]> {
    return withSupabaseFallback(
        async () => buildStaffPerformance(await getStaff()),
        () => buildStaffPerformance(mockStaff.map(toDbStaff))
    );
}

export async function getReviews(): Promise<DbReview[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await supabase!.from('reviews').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data ?? [];
        },
        () => mockReviews.map(toDbReview)
    );
}

export async function getFeedbackReviews(): Promise<CustomerReview[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await (supabase as any)
                .from('reviews')
                .select(`
                    id,
                    rating,
                    review_text,
                    is_replied,
                    created_at,
                    user:users (full_name, avatar_url),
                    product:products (name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data ?? []).map((review: any) => ({
                id: review.id,
                customerName: review.user?.full_name ?? 'Guest User',
                avatar: review.user?.avatar_url ?? IMAGES.profile,
                rating: review.rating,
                reviewText: review.review_text,
                product: review.product?.name ?? 'Coffee',
                timeAgo: formatTimeAgo(review.created_at),
                isReplied: Boolean(review.is_replied),
            }));
        },
        () => clone(mockReviews)
    );
}

export async function replyToFeedback(reviewId: string, replyText: string): Promise<CustomerReview> {
    return withSupabaseFallback(
        async () => {
            const { error } = await supabase!.from('reviews').update({ is_replied: true }).eq('id', reviewId);
            if (error) throw error;

            try {
                await (supabase as any)
                    .from('review_replies')
                    .upsert({ review_id: reviewId, reply_text: replyText, replied_at: nowIso() });
            } catch {
                // optional table
            }

            const reviews = await getFeedbackReviews();
            const updated = reviews.find((review) => review.id === reviewId);
            if (!updated) throw new Error('Review not found after update');
            return { ...updated, replyText };
        },
        () => {
            const review = mockReviews.find((entry) => entry.id === reviewId);
            if (!review) throw new Error('Review not found');
            review.isReplied = true;
            review.replyText = replyText;
            return clone(review);
        }
    );
}

export async function getAnalytics(): Promise<AnalyticsData> {
    return withSupabaseFallback(
        async () => {
            const [orders, queue] = await Promise.all([getOrders(), getOrderQueue()]);
            const revenue = orders
                .filter((order) => ['Ready', 'Completed'].includes(order.status))
                .reduce((sum, order) => sum + Number(order.total), 0);

            const sellerCounts = new Map<string, number>();
            for (const queueOrder of queue) {
                for (const item of queueOrder.items) {
                    sellerCounts.set(item.name, (sellerCounts.get(item.name) ?? 0) + item.quantity);
                }
            }

            const sortedSellers = [...sellerCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
            const maxSellerCount = sortedSellers[0]?.[1] ?? 1;
            const topSellers = sortedSellers.map(([name, count]) => ({
                name,
                count,
                percentage: Math.max(10, Math.round((count / maxSellerCount) * 100)),
            }));

            return {
                ...ANALYTICS_DATA,
                totalOrders: orders.length,
                revenue: Math.round(revenue),
                activeMembers: Math.max(ANALYTICS_DATA.activeMembers, orders.length * 2),
                topSellers: topSellers.length ? topSellers : ANALYTICS_DATA.topSellers,
            };
        },
        () => buildMockAnalytics()
    );
}

export async function getCampaigns(): Promise<Campaign[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await (supabase as any)
                .from('campaigns')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;

            return (data ?? []).map((campaign: any) => ({
                id: campaign.id,
                name: campaign.name,
                offerType: campaign.offer_type,
                discountValue: campaign.discount_value,
                minPurchase: campaign.min_purchase,
                startDate: campaign.start_date,
                endDate: campaign.end_date,
                targetAudience: campaign.target_audience,
                status: campaign.status,
            }));
        },
        () => clone(mockCampaigns)
    );
}

export async function saveCampaign(campaign: Omit<Campaign, 'id'> & { id?: string }): Promise<Campaign> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await (supabase as any)
                .from('campaigns')
                .upsert({
                    id: campaign.id,
                    name: campaign.name,
                    offer_type: campaign.offerType,
                    discount_value: campaign.discountValue,
                    min_purchase: campaign.minPurchase,
                    start_date: campaign.startDate,
                    end_date: campaign.endDate,
                    target_audience: campaign.targetAudience,
                    status: campaign.status,
                })
                .select('*')
                .single();
            if (error) throw error;

            return {
                id: data.id,
                name: data.name,
                offerType: data.offer_type,
                discountValue: data.discount_value,
                minPurchase: data.min_purchase,
                startDate: data.start_date,
                endDate: data.end_date,
                targetAudience: data.target_audience,
                status: data.status,
            };
        },
        () => {
            if (campaign.id) {
                const index = mockCampaigns.findIndex((entry) => entry.id === campaign.id);
                if (index >= 0) {
                    mockCampaigns[index] = { ...mockCampaigns[index], ...campaign, id: campaign.id };
                    return clone(mockCampaigns[index]);
                }
            }
            const created: Campaign = { ...campaign, id: randomId('campaign') };
            mockCampaigns.unshift(created);
            return clone(created);
        }
    );
}

export async function getNotificationHistory(): Promise<NotificationHistoryItem[]> {
    return withSupabaseFallback(
        async () => {
            const { data, error } = await (supabase as any)
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;

            return (data ?? []).map((item: any) => ({
                id: item.id,
                title: item.title,
                message: item.message,
                audience: item.audience,
                delivery: item.delivery,
                status: item.status,
                targetCount: item.target_count,
                scheduledFor: item.scheduled_for ?? undefined,
                createdAt: item.created_at,
            }));
        },
        () => clone(mockNotificationHistory)
    );
}

export async function sendNotification(payload: {
    title: string;
    message: string;
    audience: NotificationAudience;
    delivery: 'now' | 'scheduled';
    scheduledFor?: string;
}): Promise<NotificationHistoryItem> {
    const status: NotificationHistoryItem['status'] = payload.delivery === 'now' ? 'Sent' : 'Scheduled';

    return withSupabaseFallback(
        async () => {
            const { data, error } = await (supabase as any)
                .from('notifications')
                .insert({
                    title: payload.title,
                    message: payload.message,
                    audience: payload.audience,
                    delivery: payload.delivery,
                    status,
                    target_count: AUDIENCE_COUNTS[payload.audience],
                    scheduled_for: payload.delivery === 'scheduled' ? payload.scheduledFor ?? null : null,
                })
                .select('*')
                .single();
            if (error) throw error;

            return {
                id: data.id,
                title: data.title,
                message: data.message,
                audience: data.audience,
                delivery: data.delivery,
                status: data.status,
                targetCount: data.target_count,
                scheduledFor: data.scheduled_for ?? undefined,
                createdAt: data.created_at,
            };
        },
        () => {
            const notification: NotificationHistoryItem = {
                id: randomId('notification'),
                title: payload.title,
                message: payload.message,
                audience: payload.audience,
                delivery: payload.delivery,
                status,
                targetCount: AUDIENCE_COUNTS[payload.audience],
                scheduledFor: payload.delivery === 'scheduled' ? payload.scheduledFor : undefined,
                createdAt: nowIso(),
            };
            mockNotificationHistory.unshift(notification);
            return clone(notification);
        }
    );
}

export async function getRewards() {
    return REWARDS;
}
