import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface AppState {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number, size?: 'S' | 'M' | 'L', customizations?: string[]) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, delta: number) => void;
    clearCart: () => void;
    cartTotal: () => number;

    isAdminMode: boolean;
    toggleAdminMode: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product, quantity = 1, size = 'M', customizations = []) => set((state) => {
                const existingIndex = state.cart.findIndex(
                    item => item.product.id === product.id && item.size === size
                );

                if (existingIndex > -1) {
                    const newCart = [...state.cart];
                    newCart[existingIndex].quantity += quantity;
                    return { cart: newCart };
                }

                return {
                    cart: [...state.cart, { product, quantity, size, customizations }]
                };
            }),

            removeFromCart: (index) => set((state) => ({
                cart: state.cart.filter((_, i) => i !== index)
            })),

            updateQuantity: (index, delta) => set((state) => {
                const newCart = [...state.cart];
                const item = newCart[index];
                const newQty = item.quantity + delta;

                if (newQty <= 0) {
                    return { cart: state.cart.filter((_, i) => i !== index) };
                }

                newCart[index] = { ...item, quantity: newQty };
                return { cart: newCart };
            }),

            clearCart: () => set({ cart: [] }),

            cartTotal: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            },

            isAdminMode: false,
            toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
        }),
        {
            name: 'brew-co-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
