import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Shared';
import { useStore } from '../store/useStore';

export const CartScreen = () => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useStore();

    return (
        <div className="h-screen flex flex-col bg-bg-dark">
            <Header title="Cart" showBack onBack={() => navigate(-1)} />

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {!cart.length && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-6xl text-white/10">shopping_cart</span>
                        <p className="mt-4 text-text-subtle">Your cart is empty.</p>
                        <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 rounded-xl bg-primary text-bg-dark font-bold">
                            Browse Menu
                        </button>
                    </div>
                )}

                {cart.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="bg-card-dark rounded-xl border border-white/5 p-3">
                        <div className="flex gap-3">
                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-bold text-cream">{item.product.name}</p>
                                    <p className="font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="text-xs text-text-subtle mt-1">Size {item.size}{item.customizations.length ? ` • ${item.customizations.join(', ')}` : ''}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(index, -1)} className="size-7 rounded bg-white/5 text-cream border border-white/10">-</button>
                                        <span className="text-sm font-bold text-cream w-5 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, 1)} className="size-7 rounded bg-white/5 text-cream border border-white/10">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="text-xs font-bold text-red-400">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="border-t border-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-subtle">Subtotal</span>
                        <span className="font-bold text-cream">${cartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg">
                        <span className="font-bold text-cream">Total</span>
                        <span className="font-bold text-primary">${cartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={clearCart} className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-cream font-bold text-sm">Clear</button>
                        <button onClick={() => navigate('/checkout')} className="flex-1 py-3 rounded-xl bg-primary text-bg-dark font-bold">Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};
