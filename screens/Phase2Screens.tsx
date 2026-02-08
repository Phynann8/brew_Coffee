import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Shared';
import { ORDER_QUEUE, REVIEWS, ANALYTICS_DATA, IMAGES } from '../constants';
import { OrderQueueItem } from '../types';

// LIVE ORDER QUEUE
export const LiveQueueScreen = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'new' | 'brewing' | 'ready'>('all');
    const [orders, setOrders] = useState(ORDER_QUEUE);

    const filteredOrders = orders.filter(order => {
        if (filter === 'new') return order.status === 'New';
        if (filter === 'brewing') return order.status === 'Brewing' || order.status === 'Critical';
        if (filter === 'ready') return order.status === 'Ready';
        return true;
    });

    const getStatusColor = (status: OrderQueueItem['status']) => {
        switch (status) {
            case 'Critical': return { border: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' };
            case 'Brewing': return { border: 'border-primary', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-primary' };
            case 'New': return { border: 'border-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-500' };
            case 'Ready': return { border: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' };
        }
    };

    const getStatusLabel = (status: OrderQueueItem['status']) => {
        switch (status) {
            case 'Critical': return 'Critical Wait';
            case 'Brewing': return 'Brewing';
            case 'New': return 'New Order';
            case 'Ready': return 'Ready';
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/5 shadow-sm">
                <div className="max-w-7xl mx-auto w-full px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-cream flex size-10 items-center justify-center hover:bg-white/5 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-cream text-xl font-bold">Live Queue</h2>
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                        {orders.filter(o => o.status !== 'Ready').length} Active
                    </span>
                </div>

                {/* Filter Chips */}
                <div className="py-2 px-4 border-t border-white/5">
                    <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'new', label: 'New' },
                            { key: 'brewing', label: 'Brewing' },
                            { key: 'ready', label: 'Ready' },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key as any)}
                                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-all ${filter === f.key
                                    ? 'bg-cream text-bg-dark font-bold shadow-sm scale-105'
                                    : 'bg-card-dark border border-white/10 text-text-subtle hover:text-cream hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-sm">{f.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Order Cards */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
                    {filteredOrders.map((order) => {
                        const colors = getStatusColor(order.status);
                        return (
                            <div
                                key={order.id}
                                className={`relative flex flex-col rounded-xl shadow-lg bg-card-dark overflow-hidden border-l-[6px] ${colors.border} transition-transform hover:scale-[1.01]`}
                            >
                                <div className="flex flex-row p-4 gap-4">
                                    {/* Image */}
                                    <div
                                        className="w-20 h-20 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg bg-surface-dark"
                                        style={{ backgroundImage: `url('${order.image}')` }}
                                    ></div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col">
                                                <span className={`${colors.text} text-xs font-bold tracking-wider uppercase mb-0.5`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                                <h3 className="text-cream text-lg font-bold leading-tight">
                                                    #{order.orderNumber} • {order.customerName}
                                                </h3>
                                            </div>
                                            <div className={`flex items-center gap-1 ${colors.text} ${colors.bg} px-2 py-1 rounded`}>
                                                <span className="material-symbols-outlined text-sm">timer</span>
                                                <span className="text-sm font-bold font-mono">{order.timer}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <p className="text-text-subtle text-sm font-medium mb-2">
                                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {order.customizations.map((c, idx) => (
                                                    <span key={idx} className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-text-subtle ring-1 ring-inset ring-white/10">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="p-4 pt-0 mt-auto flex gap-3">
                                    {order.status === 'New' ? (
                                        <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-primary text-primary hover:bg-primary/10 text-sm font-bold transition-colors">
                                            Start Brewing
                                        </button>
                                    ) : order.status === 'Ready' ? (
                                        <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-colors">
                                            Complete Order
                                        </button>
                                    ) : (
                                        <>
                                            <button className="flex-1 cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white/5 text-text-subtle text-sm font-semibold hover:bg-white/10 transition-colors">
                                                Cancel
                                            </button>
                                            <button className="flex-[2] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:brightness-110 text-bg-dark text-sm font-bold transition-colors shadow-md shadow-primary/20">
                                                Mark Ready
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-cream text-bg-dark shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-3xl">pause</span>
            </button>
        </div>
    );
};

// ANALYTICS DASHBOARD
export const AnalyticsScreen = () => {
    const navigate = useNavigate();
    const data = ANALYTICS_DATA;

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center bg-bg-dark/95 backdrop-blur-md p-4 justify-between border-b border-white/5">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="text-cream flex size-10 items-center justify-center hover:bg-white/5 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-cream text-xl font-bold flex-1 text-center">Analytics</h2>
                    <button className="flex items-center gap-2 bg-card-dark border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-text-subtle text-sm">calendar_today</span>
                        <span className="text-sm text-cream">Today</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="max-w-7xl mx-auto space-y-6 pb-24">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-card-dark p-6 rounded-xl border border-white/5 flex flex-col justify-between h-32 md:h-40 hover:border-white/10 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
                            <div>
                                <p className="text-3xl font-bold text-cream">{data.totalOrders}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-text-subtle">Total Orders</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${data.orderChange >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                        {data.orderChange >= 0 ? '+' : ''}{data.orderChange}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card-dark p-6 rounded-xl border border-white/5 flex flex-col justify-between h-32 md:h-40 hover:border-white/10 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
                            <div>
                                <p className="text-3xl font-bold text-cream">${data.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-text-subtle">Revenue</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${data.revenueChange >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                        {data.revenueChange >= 0 ? '+' : ''}{data.revenueChange}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-1 bg-card-dark p-6 rounded-xl border border-white/5 flex flex-col md:justify-between justify-center h-32 md:h-40 gap-3 md:gap-0 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-3xl">group</span>
                                <span className="text-green-400 font-bold text-sm bg-green-400/10 px-2 py-1 rounded">+{data.memberChange}%</span>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-cream">{data.activeMembers}</p>
                                <span className="text-sm text-text-subtle">Active Members</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Rush Hour Chart */}
                        <div className="bg-card-dark rounded-xl p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-sm text-text-subtle font-medium">Rush Hour Tracking</p>
                                    <p className="text-2xl font-bold text-cream mt-1">Peak: {data.peakHour}</p>
                                </div>
                                <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
                            </div>

                            <div className="flex items-end justify-between h-48 gap-3">
                                {[30, 45, 65, 90, 75, 50, 35, 20].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full h-full flex items-end">
                                            <div
                                                className={`w-full rounded-t-md transition-all duration-500 group-hover:bg-primary ${i === 3 ? 'bg-primary shadow-[0_0_15px_rgba(208,160,117,0.3)]' : 'bg-primary/30'}`}
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-text-subtle">{9 + i}am</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Sellers & Loyalty Split */}
                        <div className="grid grid-rows-2 gap-6">
                            {/* Top Sellers */}
                            <div className="bg-card-dark rounded-xl p-6 border border-white/5 flex flex-col">
                                <h3 className="font-bold text-cream mb-4 text-lg">Top Sellers</h3>
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {data.topSellers.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <span className="text-xl font-black text-white/5 group-hover:text-primary/20 transition-colors w-8 text-center">{idx + 1}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <p className="text-sm font-bold text-cream">{item.name}</p>
                                                    <span className="text-xs text-text-subtle font-mono">{item.count} sold</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary/80 to-primary" style={{ width: `${item.percentage}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Loyalty Leaders */}
                            <div className="bg-card-dark rounded-xl p-6 border border-white/5 flex flex-col">
                                <h3 className="font-bold text-cream mb-4 text-lg">Loyalty Leaders</h3>
                                <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {data.loyaltyLeaders.slice(0, 3).map((leader, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <div
                                                className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-primary/20"
                                                style={{ backgroundImage: `url('${leader.avatar}')` }}
                                            ></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-cream">{leader.name}</p>
                                                <div className="flex items-center gap-1 text-primary">
                                                    <span className="material-symbols-outlined text-[10px]">star</span>
                                                    <span className="text-xs font-bold">{leader.points.toLocaleString()} pts</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-text-subtle font-medium">{leader.lastVisit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// CUSTOMER FEEDBACK
export const FeedbackScreen = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<number | null>(null);

    const filteredReviews = filter
        ? REVIEWS.filter(r => r.rating === filter)
        : REVIEWS;

    const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-hidden">
            <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto w-full px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 text-cream transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-cream text-lg font-bold leading-tight tracking-tight flex-1 text-center">Customer Feedback</h2>
                    <div className="size-10" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar / Stats */}
                    <div className="space-y-6">
                        {/* Sentiment Summary */}
                        <div className="rounded-xl bg-card-dark p-6 border border-white/5 sticky top-4">
                            <div className="flex flex-col gap-1 mb-6">
                                <p className="text-sm font-medium text-text-subtle uppercase tracking-wider">Overall Rating</p>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-5xl font-black text-cream">{avgRating}</h2>
                                    <div className="flex flex-col">
                                        <div className="flex text-primary">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined text-xl fill-current">star</span>
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-green-400 mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">trending_up</span>
                                            Top 5% of stores
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-text-subtle mb-3">Filter by Rating</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter(null)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === null ? 'bg-primary text-bg-dark scale-105' : 'bg-white/5 text-text-subtle hover:bg-white/10 hover:text-cream'
                                        }`}
                                >
                                    All Reviews
                                </button>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setFilter(star)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === star ? 'bg-primary text-bg-dark scale-105' : 'bg-white/5 text-text-subtle hover:bg-white/10 hover:text-cream'
                                            }`}
                                    >
                                        {star} <span className="material-symbols-outlined text-sm">star</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2 space-y-4">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="bg-card-dark rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-start gap-4 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border border-white/10 shadow-lg"
                                        style={{ backgroundImage: `url('${review.avatar}')` }}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-cream text-lg">{review.customerName}</h4>
                                            {review.isReplied && (
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-500/20">
                                                    Replied
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'text-primary' : 'text-white/10'}`}>
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-text-subtle font-medium">• {review.timeAgo}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-base text-cream/90 mb-4 leading-relaxed">{review.reviewText}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-text-subtle text-sm">local_cafe</span>
                                        <span className="text-xs font-bold text-text-subtle">{review.product}</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-primary text-sm font-bold hover:brightness-110 transition-all bg-primary/10 px-4 py-2 rounded-lg">
                                        <span className="material-symbols-outlined text-lg">reply</span>
                                        {review.isReplied ? 'Edit Reply' : 'Reply'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
