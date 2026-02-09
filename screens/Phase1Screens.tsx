import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components/Shared';
import { STORES, PAST_ORDERS, REWARDS, IMAGES } from '../constants';
import { Store } from '../types';
import { useStore } from '../store/useStore';

// STORE LOCATOR
export const StoreLocatorScreen = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'open' | 'driveThru' | 'mobile'>('open');

    const filteredStores = STORES.filter(store => {
        if (filter === 'open') return store.isOpen;
        if (filter === 'driveThru') return store.hasDriveThru;
        if (filter === 'mobile') return store.hasMobileOrder;
        return true;
    });

    const handleSelectStore = (store: Store) => {
        // Logic to set active store would go here
        console.log("Selected store:", store);
        navigate('/'); // Navigate back to home/menu after selection
    };

    return (
        <div className="h-screen flex flex-col relative">
            {/* Map Background */}
            <div className="absolute inset-0 z-0 bg-[#181611]">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfKyozfxMW0CF2Ld76O819Qmb2us-W-ayw0CQQbX0UJdj77s77d9lTXk3x05H_Ujw7X3-U8Peeoa9SJXSrjAsgmX_Hfyy-KrwIds218rrCmeW_gmGMrXoQzyMgFAb0qyK_XvWME-L8W76fM1go-F4vOYNbNGWihEPbTEIwfeereh-_QskDmlSEMm411M_ogChS-nU1zI42PK7oBVquL2IakpqapkFkxe5m4XKd681fAwba5TUPFGO6SHq44Mcr0rgSSRfNyVTyOePD"
                    className="h-full w-full object-cover opacity-60 grayscale-[20%] contrast-125"
                    alt="Map"
                />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Search Bar */}
            <div className="absolute top-0 left-0 w-full z-20 px-4 pt-14 pb-2">
                <div className="flex w-full h-14 items-center rounded-xl bg-surface-dark/90 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20">
                    <div className="text-text-subtle flex items-center justify-center pl-4">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="flex w-full min-w-0 flex-1 bg-transparent text-cream focus:outline-none placeholder:text-text-subtle px-3 text-base"
                        placeholder="Find a cafe nearby..."
                    />
                    <button className="pr-4 text-text-subtle hover:text-cream">
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </div>
            </div>

            {/* Map Controls */}
            <div className="absolute right-4 top-36 z-10 flex flex-col gap-3">
                <div className="flex flex-col rounded-xl bg-surface-dark/90 backdrop-blur-md shadow-lg border border-white/10 overflow-hidden">
                    <button className="flex size-12 items-center justify-center hover:bg-white/5 border-b border-white/10">
                        <span className="material-symbols-outlined text-cream">add</span>
                    </button>
                    <button className="flex size-12 items-center justify-center hover:bg-white/5">
                        <span className="material-symbols-outlined text-cream">remove</span>
                    </button>
                </div>
                <button className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg text-bg-dark hover:brightness-110">
                    <span className="material-symbols-outlined">near_me</span>
                </button>
            </div>

            {/* Bottom Sheet */}
            <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col max-h-[65vh] bg-bg-dark rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] border-t border-white/5">
                {/* Handle */}
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
                </div>

                {/* Header */}
                <div className="px-5 pt-2 pb-4">
                    <h2 className="text-cream text-2xl font-bold">Nearby Cafes</h2>
                </div>

                {/* Filters */}
                <div className="flex gap-3 px-5 pb-4 overflow-x-auto no-scrollbar">
                    {[
                        { key: 'open', label: 'Open Now' },
                        { key: 'driveThru', label: 'Drive Thru' },
                        { key: 'mobile', label: 'Mobile Order' },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as any)}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 ${filter === f.key
                                ? 'bg-primary text-bg-dark font-bold shadow-sm'
                                : 'bg-card-dark border border-white/10 text-cream hover:bg-white/5'
                                }`}
                        >
                            <span className="text-sm font-medium">{f.label}</span>
                        </button>
                    ))}
                </div>

                {/* Store List */}
                <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4 no-scrollbar">
                    {filteredStores.map((store, idx) => (
                        <div
                            key={store.id}
                            className={`flex flex-col gap-3 rounded-xl bg-card-dark p-4 border ${idx === 0 ? 'border-primary/30 shadow-md' : 'border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div
                                        className="h-16 w-16 rounded-lg bg-cover bg-center shrink-0"
                                        style={{ backgroundImage: `url('${store.image}')` }}
                                    ></div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-cream">{store.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-xs font-medium text-white/60">{store.distance}</span>
                                            <span className="h-0.5 w-0.5 rounded-full bg-white/40"></span>
                                            <span className="text-xs font-medium text-white/60">{store.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs font-bold ${store.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                                                {store.isOpen ? 'Open' : 'Closed'}
                                            </span>
                                            <span className="text-xs text-white/60">
                                                {store.isOpen ? `Closes ${store.closingTime}` : `Opens ${store.closingTime}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="material-symbols-outlined text-primary text-xl">star</span>
                                    <span className="text-xs font-bold text-cream">{store.rating}</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-white/5 my-1"></div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">Busy Level</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${store.busyLevel === 'Low' ? 'bg-primary w-[30%]' :
                                                    store.busyLevel === 'Medium' ? 'bg-yellow-400 w-[60%]' :
                                                        'bg-red-400 w-[85%]'
                                                    }`}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-medium ${store.busyLevel === 'Low' ? 'text-primary' :
                                            store.busyLevel === 'Medium' ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>{store.busyLevel}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSelectStore(store)}
                                    className="h-9 px-6 rounded-lg bg-primary text-bg-dark text-sm font-bold hover:brightness-110 flex items-center gap-2"
                                >
                                    <span>Order Here</span>
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-30 p-2 bg-black/30 backdrop-blur rounded-full text-white"
            >
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
        </div>
    );
};

// CHECKOUT / REVIEW ORDER
export const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, cartTotal, submitCartOrder, adminLoading } = useStore();
    const [tip, setTip] = useState(0);

    const subtotal = cartTotal();
    const tax = subtotal * 0.09;
    const total = subtotal + tax + tip;

    const handlePlaceOrder = async () => {
        if (!cart.length) {
            navigate('/');
            return;
        }

        const orderId = await submitCartOrder('Alex');
        if (orderId) {
            navigate('/track-order', { state: { orderId } });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-bg-dark">
            <Header title="Review Order" showBack />

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <div className="bg-card-dark rounded-xl p-4 border border-white/5">
                    <h3 className="text-sm font-bold text-text-subtle uppercase tracking-widest mb-4">Your Items</h3>

                    {!cart.length && (
                        <p className="text-sm text-text-subtle">Your cart is empty. Add items before checkout.</p>
                    )}

                    <div className="space-y-4">
                        {cart.map((item, index) => (
                            <div key={`${item.product.id}-${index}`} className="flex gap-4">
                                <img src={item.product.image} className="w-16 h-16 rounded-lg object-cover" alt={item.product.name} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-cream">{item.product.name}</h4>
                                        <span className="text-cream font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-text-subtle">{item.size} • {item.customizations.join(', ') || 'Standard'}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQuantity(index, -1)} className="w-6 h-6 rounded bg-white/5 text-cream flex items-center justify-center">-</button>
                                            <span className="text-cream font-bold">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(index, 1)} className="w-6 h-6 rounded bg-white/5 text-cream flex items-center justify-center">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(index)} className="text-xs text-red-400 font-bold">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card-dark rounded-xl p-4 border border-white/5">
                    <h3 className="text-sm font-bold text-text-subtle uppercase tracking-widest mb-4">Add a Tip</h3>
                    <div className="flex gap-3">
                        {[0, 1, 2, 3].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTip(t)}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm ${tip === t ? 'bg-primary text-bg-dark' : 'bg-white/5 text-cream hover:bg-white/10'}`}
                            >
                                {t === 0 ? 'None' : `$${t}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-card-dark rounded-xl p-4 border border-white/5">
                    <h3 className="text-sm font-bold text-text-subtle uppercase tracking-widest mb-4">Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-subtle">Subtotal</span>
                            <span className="text-cream">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-subtle">Tax</span>
                            <span className="text-cream">${tax.toFixed(2)}</span>
                        </div>
                        {tip > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-subtle">Tip</span>
                                <span className="text-cream">${tip.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between text-lg">
                            <span className="font-bold text-cream">Total</span>
                            <span className="font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-white/5">
                <Button onClick={handlePlaceOrder} className={!cart.length || adminLoading ? 'opacity-60 pointer-events-none' : ''}>
                    {adminLoading ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
                </Button>
            </div>
        </div>
    );
};

// ORDER HISTORY
export const OrderHistoryScreen = () => {
    const navigate = useNavigate();

    const handleReorder = (orderId: string) => {
        console.log("Reordering:", orderId);
        navigate('/cart'); // Example: go to cart with reordered items
    };

    return (
        <div className="h-screen flex flex-col bg-bg-dark">
            <Header title="Your Orders" showBack />

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {PAST_ORDERS.map((order) => (
                    <div key={order.id} className="bg-card-dark rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-xs text-text-subtle">{order.date}</p>
                                <h3 className="font-bold text-cream mt-1">Order #{order.id}</h3>
                            </div>
                            <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded font-bold">
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-1 mb-4">
                            {order.items.map((item, idx) => (
                                <p key={idx} className="text-sm text-text-subtle">â€¢ {item}</p>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <span className="font-bold text-cream">${order.total.toFixed(2)}</span>
                            <button
                                onClick={() => handleReorder(order.id)}
                                className="flex items-center gap-2 text-primary font-bold text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">replay</span>
                                Reorder
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// REWARDS SCREEN
export const RewardsScreen = () => {
    const navigate = useNavigate();
    const userPoints = 350;

    return (
        <div className="h-screen flex flex-col bg-bg-dark">
            <Header title="Brew Rewards" showBack />

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {/* Points Card */}
                <div className="bg-gradient-to-br from-[#3d2b1f] to-[#1a120b] p-6 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 text-white/5">
                        <span className="material-symbols-outlined text-9xl">workspace_premium</span>
                    </div>
                    <div className="relative z-10">
                        <span className="text-primary text-xs font-bold uppercase tracking-widest">Gold Member</span>
                        <h2 className="text-4xl font-bold text-cream mt-2">{userPoints}</h2>
                        <p className="text-text-subtle text-sm">points available</p>

                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-text-subtle mb-1">
                                <span>Progress to Platinum</span>
                                <span>350 / 500</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[70%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Rewards */}
                <div>
                    <h3 className="text-lg font-bold text-cream mb-4">Available Rewards</h3>
                    <div className="space-y-3">
                        {REWARDS.map((reward) => (
                            <div key={reward.id} className="bg-card-dark rounded-xl p-4 border border-white/5 flex gap-4">
                                <img src={reward.image} className="w-16 h-16 rounded-lg object-cover" alt={reward.name} />
                                <div className="flex-1">
                                    <h4 className="font-bold text-cream">{reward.name}</h4>
                                    <p className="text-xs text-text-subtle">{reward.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="material-symbols-outlined text-primary text-sm">star</span>
                                        <span className="text-primary font-bold text-sm">{reward.pointsCost} pts</span>
                                    </div>
                                </div>
                                <button
                                    disabled={userPoints < reward.pointsCost}
                                    className={`self-center px-4 py-2 rounded-lg text-sm font-bold ${userPoints >= reward.pointsCost
                                        ? 'bg-primary text-bg-dark'
                                        : 'bg-white/5 text-text-subtle cursor-not-allowed'
                                        }`}
                                >
                                    Redeem
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How to Earn */}
                <div className="bg-card-dark rounded-xl p-4 border border-white/5">
                    <h3 className="font-bold text-cream mb-3">How to Earn Points</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">shopping_bag</span>
                            <span className="text-text-subtle">Earn 1 point per $1 spent</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">group_add</span>
                            <span className="text-text-subtle">Refer a friend: +50 points</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">cake</span>
                            <span className="text-text-subtle">Birthday bonus: +100 points</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

