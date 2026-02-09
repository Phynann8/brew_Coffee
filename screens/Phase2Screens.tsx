import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Shared';
import { useStore } from '../store/useStore';

export const LiveQueueScreen = () => {
    const navigate = useNavigate();
    const { orderQueue, adminLoading, adminError, loadQueue, transitionQueueOrder } = useStore();
    const [filter, setFilter] = useState<'all' | 'new' | 'brewing' | 'ready'>('all');

    useEffect(() => {
        if (!orderQueue.length) {
            loadQueue();
        }
    }, [loadQueue, orderQueue.length]);

    const filtered = useMemo(() => {
        return orderQueue.filter((order) => {
            if (filter === 'new') return order.status === 'New';
            if (filter === 'brewing') return order.status === 'Brewing' || order.status === 'Critical';
            if (filter === 'ready') return order.status === 'Ready';
            return true;
        });
    }, [filter, orderQueue]);

    const runAction = async (orderId: string, action: 'start-brewing' | 'mark-ready' | 'complete-order' | 'cancel-order') => {
        await transitionQueueOrder(orderId, action);
    };

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Live Queue" showBack onBack={() => navigate(-1)} />

            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'new', label: 'New' },
                        { key: 'brewing', label: 'Brewing' },
                        { key: 'ready', label: 'Ready' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key as typeof filter)}
                            className={`px-4 py-2 rounded-full text-xs font-bold ${filter === item.key ? 'bg-primary text-bg-dark' : 'bg-card-dark text-text-subtle border border-white/10'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <button onClick={loadQueue} className="text-xs font-bold text-primary">Refresh</button>
            </div>

            {adminError && <p className="px-4 pt-3 text-sm text-red-400">{adminError}</p>}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
                {adminLoading && !filtered.length && <p className="text-text-subtle">Loading queue...</p>}
                {!adminLoading && !filtered.length && <p className="text-text-subtle">No orders in this view.</p>}

                {filtered.map((order) => (
                    <div key={order.id} className="bg-card-dark border border-white/5 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs text-text-subtle uppercase tracking-wider">#{order.orderNumber}</p>
                                <h3 className="text-lg font-bold text-cream">{order.customerName}</h3>
                                <p className="text-sm text-text-subtle mt-1">{order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-primary">{order.status}</span>
                                <p className="text-xs text-text-subtle mt-1">{order.timer}</p>
                            </div>
                        </div>

                        {!!order.customizations.length && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {order.customizations.map((customization, index) => (
                                    <span key={`${order.id}-${index}`} className="text-[11px] px-2 py-1 rounded bg-white/5 text-text-subtle border border-white/10">
                                        {customization}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            {(order.status === 'New' || order.status === 'Critical') && (
                                <button onClick={() => runAction(order.id, 'start-brewing')} className="flex-1 py-2 rounded-lg bg-primary text-bg-dark font-bold text-sm">Start Brewing</button>
                            )}

                            {order.status === 'Brewing' && (
                                <button onClick={() => runAction(order.id, 'mark-ready')} className="flex-1 py-2 rounded-lg bg-primary text-bg-dark font-bold text-sm">Mark Ready</button>
                            )}

                            {order.status === 'Ready' && (
                                <button onClick={() => runAction(order.id, 'complete-order')} className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-bold text-sm">Complete</button>
                            )}

                            <button onClick={() => runAction(order.id, 'cancel-order')} className="py-2 px-4 rounded-lg bg-white/5 text-text-subtle text-sm border border-white/10">
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnalyticsScreen = () => {
    const navigate = useNavigate();
    const { analytics, adminLoading, adminError, loadAnalytics } = useStore();

    useEffect(() => {
        if (!analytics) loadAnalytics();
    }, [analytics, loadAnalytics]);

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Analytics" showBack onBack={() => navigate(-1)} />

            <div className="px-4 py-3 border-b border-white/5 flex justify-end">
                <button onClick={loadAnalytics} className="text-xs font-bold text-primary">Refresh</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
                {adminLoading && !analytics && <p className="text-text-subtle">Loading analytics...</p>}
                {adminError && <p className="text-sm text-red-400">{adminError}</p>}

                {analytics && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-card-dark rounded-xl border border-white/5 p-4">
                                <p className="text-xs text-text-subtle">Total Orders</p>
                                <p className="text-2xl font-bold text-cream mt-1">{analytics.totalOrders}</p>
                                <p className="text-xs text-primary mt-1">{analytics.orderChange >= 0 ? '+' : ''}{analytics.orderChange}%</p>
                            </div>
                            <div className="bg-card-dark rounded-xl border border-white/5 p-4">
                                <p className="text-xs text-text-subtle">Revenue</p>
                                <p className="text-2xl font-bold text-cream mt-1">${analytics.revenue.toLocaleString()}</p>
                                <p className="text-xs text-primary mt-1">{analytics.revenueChange >= 0 ? '+' : ''}{analytics.revenueChange}%</p>
                            </div>
                            <div className="col-span-2 bg-card-dark rounded-xl border border-white/5 p-4">
                                <p className="text-xs text-text-subtle">Active Members</p>
                                <p className="text-2xl font-bold text-cream mt-1">{analytics.activeMembers}</p>
                                <p className="text-xs text-primary mt-1">{analytics.memberChange >= 0 ? '+' : ''}{analytics.memberChange}%</p>
                            </div>
                        </div>

                        <div className="bg-card-dark rounded-xl border border-white/5 p-4">
                            <h3 className="text-sm font-bold text-cream mb-3">Top Sellers</h3>
                            <div className="space-y-3">
                                {analytics.topSellers.map((item) => (
                                    <div key={item.name}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-cream font-bold">{item.name}</span>
                                            <span className="text-text-subtle">{item.count} sold</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const FeedbackScreen = () => {
    const navigate = useNavigate();
    const { feedback, adminLoading, adminError, loadFeedback, replyToFeedback } = useStore();
    const [filter, setFilter] = useState<number | null>(null);
    const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!feedback.length) {
            loadFeedback();
        }
    }, [feedback.length, loadFeedback]);

    const filteredFeedback = useMemo(() => {
        return filter ? feedback.filter((review) => review.rating === filter) : feedback;
    }, [feedback, filter]);

    const averageRating = useMemo(() => {
        if (!feedback.length) return '0.0';
        const total = feedback.reduce((sum, review) => sum + review.rating, 0);
        return (total / feedback.length).toFixed(1);
    }, [feedback]);

    const handleReply = async (reviewId: string) => {
        const message = (replyDrafts[reviewId] ?? '').trim();
        if (!message) return;
        await replyToFeedback(reviewId, message);
        setReplyDrafts((state) => ({ ...state, [reviewId]: '' }));
    };

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Customer Feedback" showBack onBack={() => navigate(-1)} />

            <div className="px-4 py-4 border-b border-white/5">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-text-subtle">Average Rating</p>
                        <p className="text-3xl font-bold text-cream mt-1">{averageRating}</p>
                    </div>
                    <button onClick={loadFeedback} className="text-xs font-bold text-primary">Refresh</button>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                    <button onClick={() => setFilter(null)} className={`px-3 py-2 rounded-full text-xs font-bold ${filter === null ? 'bg-primary text-bg-dark' : 'bg-card-dark text-text-subtle border border-white/10'}`}>
                        All
                    </button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFilter(rating)}
                            className={`px-3 py-2 rounded-full text-xs font-bold ${filter === rating ? 'bg-primary text-bg-dark' : 'bg-card-dark text-text-subtle border border-white/10'}`}
                        >
                            {rating} Star
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
                {adminLoading && !filteredFeedback.length && <p className="text-text-subtle">Loading feedback...</p>}
                {adminError && <p className="text-sm text-red-400">{adminError}</p>}
                {!adminLoading && !filteredFeedback.length && <p className="text-text-subtle">No reviews for this filter.</p>}

                {filteredFeedback.map((review) => (
                    <div key={review.id} className="bg-card-dark rounded-xl border border-white/5 p-4">
                        <div className="flex justify-between items-start gap-3">
                            <div>
                                <p className="text-sm font-bold text-cream">{review.customerName}</p>
                                <p className="text-xs text-text-subtle mt-1">{review.product} • {review.timeAgo}</p>
                            </div>
                            <span className="text-sm font-bold text-primary">{review.rating}/5</span>
                        </div>

                        <p className="text-sm text-cream/90 mt-3">{review.reviewText}</p>

                        {review.isReplied && (
                            <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                <p className="text-xs uppercase tracking-wider text-green-400 font-bold">Reply Sent</p>
                                {review.replyText && <p className="text-sm text-cream mt-1">{review.replyText}</p>}
                            </div>
                        )}

                        {!review.isReplied && (
                            <div className="mt-3 space-y-2">
                                <textarea
                                    value={replyDrafts[review.id] ?? ''}
                                    onChange={(event) => setReplyDrafts((state) => ({ ...state, [review.id]: event.target.value }))}
                                    className="w-full h-24 bg-bg-dark border border-white/10 rounded-lg p-3 text-sm text-cream"
                                    placeholder="Write a response..."
                                />
                                <button onClick={() => handleReply(review.id)} className="px-4 py-2 rounded-lg bg-primary text-bg-dark text-sm font-bold">
                                    Send Reply
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
