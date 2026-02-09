import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
    AnalyticsData,
    Campaign,
    CartItem,
    CustomerReview,
    NotificationAudience,
    NotificationHistoryItem,
    OrderQueueItem,
    Product,
    QueueAction,
    StaffPerformance,
} from '../types';
import * as api from '../lib/api';

type CampaignInput = Omit<Campaign, 'id'> & { id?: string };

type NotificationInput = {
    title: string;
    message: string;
    audience: NotificationAudience;
    delivery: 'now' | 'scheduled';
    scheduledFor?: string;
};

interface AppState {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number, size?: 'S' | 'M' | 'L', customizations?: string[]) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, delta: number) => void;
    clearCart: () => void;
    cartTotal: () => number;
    submitCartOrder: (customerName?: string) => Promise<string | null>;

    isAdminMode: boolean;
    toggleAdminMode: () => void;

    adminLoading: boolean;
    adminError: string | null;

    orderQueue: OrderQueueItem[];
    analytics: AnalyticsData | null;
    feedback: CustomerReview[];
    campaigns: Campaign[];
    staffPerformance: StaffPerformance[];
    notificationHistory: NotificationHistoryItem[];
    menuItems: Product[];

    refreshAdminData: () => Promise<void>;
    loadQueue: () => Promise<void>;
    transitionQueueOrder: (orderId: string, action: QueueAction) => Promise<void>;
    loadAnalytics: () => Promise<void>;
    loadFeedback: () => Promise<void>;
    replyToFeedback: (reviewId: string, replyText: string) => Promise<void>;
    loadStaffPerformance: () => Promise<void>;
    loadCampaigns: () => Promise<void>;
    saveCampaign: (campaign: CampaignInput) => Promise<Campaign | null>;
    loadNotificationHistory: () => Promise<void>;
    sendNotification: (payload: NotificationInput) => Promise<NotificationHistoryItem | null>;
    loadMenuItems: () => Promise<void>;
    createMenuItem: (item: Omit<Product, 'id'> & { id?: string }) => Promise<Product | null>;
    updateMenuItem: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<Product | null>;
    deleteMenuItem: (id: string) => Promise<void>;
}

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Unexpected error';

const cartItemKey = (item: Pick<CartItem, 'product' | 'size' | 'customizations'>): string =>
    `${item.product.id}:${item.size}:${[...item.customizations].sort().join('|')}`;

const calculateCartTotal = (cart: CartItem[]): number =>
    cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product, quantity = 1, size = 'M', customizations = []) => set((state) => {
                const key = cartItemKey({ product, size, customizations });
                const existingIndex = state.cart.findIndex((item) => cartItemKey(item) === key);

                if (existingIndex > -1) {
                    const updated = [...state.cart];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        quantity: updated[existingIndex].quantity + quantity,
                    };
                    return { cart: updated };
                }

                return {
                    cart: [...state.cart, { product, quantity, size, customizations }],
                };
            }),
            removeFromCart: (index) => set((state) => ({
                cart: state.cart.filter((_, i) => i !== index),
            })),
            updateQuantity: (index, delta) => set((state) => {
                if (index < 0 || index >= state.cart.length) return state;
                const updated = [...state.cart];
                const nextQty = updated[index].quantity + delta;
                if (nextQty <= 0) {
                    return { cart: state.cart.filter((_, i) => i !== index) };
                }
                updated[index] = { ...updated[index], quantity: nextQty };
                return { cart: updated };
            }),
            clearCart: () => set({ cart: [] }),
            cartTotal: () => calculateCartTotal(get().cart),
            submitCartOrder: async (customerName = 'Guest') => {
                const cart = get().cart;
                if (!cart.length) return null;

                set({ adminLoading: true, adminError: null });
                try {
                    const orderId = await api.createOrderFromCart(cart, { customerName });
                    const [orderQueue, analytics] = await Promise.all([
                        api.getOrderQueue(),
                        api.getAnalytics(),
                    ]);
                    set({ cart: [], orderQueue, analytics });
                    return orderId;
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                    return null;
                } finally {
                    set({ adminLoading: false });
                }
            },

            isAdminMode: false,
            toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),

            adminLoading: false,
            adminError: null,
            orderQueue: [],
            analytics: null,
            feedback: [],
            campaigns: [],
            staffPerformance: [],
            notificationHistory: [],
            menuItems: [],

            refreshAdminData: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    const [orderQueue, analytics, feedback, campaigns, staffPerformance, notificationHistory, menuItems] = await Promise.all([
                        api.getOrderQueue(),
                        api.getAnalytics(),
                        api.getFeedbackReviews(),
                        api.getCampaigns(),
                        api.getStaffPerformance(),
                        api.getNotificationHistory(),
                        api.getMenuProducts(),
                    ]);

                    set({ orderQueue, analytics, feedback, campaigns, staffPerformance, notificationHistory, menuItems });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },

            loadQueue: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ orderQueue: await api.getOrderQueue() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            transitionQueueOrder: async (orderId, action) => {
                set({ adminLoading: true, adminError: null });
                try {
                    await api.transitionQueueOrder(orderId, action);
                    const [orderQueue, analytics] = await Promise.all([api.getOrderQueue(), api.getAnalytics()]);
                    set({ orderQueue, analytics });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            loadAnalytics: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ analytics: await api.getAnalytics() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            loadFeedback: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ feedback: await api.getFeedbackReviews() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            replyToFeedback: async (reviewId, replyText) => {
                set({ adminLoading: true, adminError: null });
                try {
                    const updated = await api.replyToFeedback(reviewId, replyText);
                    set((state) => ({
                        feedback: state.feedback.map((review) => review.id === reviewId ? updated : review),
                    }));
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            loadStaffPerformance: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ staffPerformance: await api.getStaffPerformance() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            loadCampaigns: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ campaigns: await api.getCampaigns() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            saveCampaign: async (campaign) => {
                set({ adminLoading: true, adminError: null });
                try {
                    const saved = await api.saveCampaign(campaign);
                    set((state) => {
                        const exists = state.campaigns.some((item) => item.id === saved.id);
                        return {
                            campaigns: exists
                                ? state.campaigns.map((item) => item.id === saved.id ? saved : item)
                                : [saved, ...state.campaigns],
                        };
                    });
                    return saved;
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                    return null;
                } finally {
                    set({ adminLoading: false });
                }
            },
            loadNotificationHistory: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ notificationHistory: await api.getNotificationHistory() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            sendNotification: async (payload) => {
                set({ adminLoading: true, adminError: null });
                try {
                    const created = await api.sendNotification(payload);
                    set((state) => ({ notificationHistory: [created, ...state.notificationHistory] }));
                    return created;
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                    return null;
                } finally {
                    set({ adminLoading: false });
                }
            },
            loadMenuItems: async () => {
                set({ adminLoading: true, adminError: null });
                try {
                    set({ menuItems: await api.getMenuProducts() });
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
            createMenuItem: async (item) => {
                set({ adminLoading: true, adminError: null });
                try {
                    const created = await api.createMenuItem(item);
                    set((state) => ({ menuItems: [created, ...state.menuItems] }));
                    return created;
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                    return null;
                } finally {
                    set({ adminLoading: false });
                }
            },
            updateMenuItem: async (id, updates) => {
                set({ adminLoading: true, adminError: null });
                try {
                    const updated = await api.updateMenuItem(id, updates);
                    set((state) => ({
                        menuItems: state.menuItems.map((item) => item.id === id ? updated : item),
                    }));
                    return updated;
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                    return null;
                } finally {
                    set({ adminLoading: false });
                }
            },
            deleteMenuItem: async (id) => {
                set({ adminLoading: true, adminError: null });
                try {
                    await api.deleteMenuItem(id);
                    set((state) => ({ menuItems: state.menuItems.filter((item) => item.id !== id) }));
                } catch (error) {
                    set({ adminError: getErrorMessage(error) });
                } finally {
                    set({ adminLoading: false });
                }
            },
        }),
        {
            name: 'brew-co-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cart: state.cart,
                isAdminMode: state.isAdminMode,
            }),
        }
    )
);
