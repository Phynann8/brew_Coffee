import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Shared';
import { useStore } from '../store/useStore';
import type { NotificationAudience, Product } from '../types';

export const StaffPerformanceScreen = () => {
    const navigate = useNavigate();
    const { staffPerformance, adminLoading, adminError, loadStaffPerformance } = useStore();

    useEffect(() => {
        if (!staffPerformance.length) {
            loadStaffPerformance();
        }
    }, [staffPerformance.length, loadStaffPerformance]);

    const topPerformer = useMemo(() => {
        if (!staffPerformance.length) return null;
        return [...staffPerformance].sort((a, b) => b.salesGenerated - a.salesGenerated)[0];
    }, [staffPerformance]);

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Staff Performance" showBack onBack={() => navigate(-1)} />

            <div className="px-4 py-3 border-b border-white/5 flex justify-end">
                <button onClick={loadStaffPerformance} className="text-xs font-bold text-primary">Refresh</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
                {adminLoading && !staffPerformance.length && <p className="text-text-subtle">Loading staff metrics...</p>}
                {adminError && <p className="text-sm text-red-400">{adminError}</p>}

                {topPerformer && (
                    <div className="bg-card-dark rounded-xl border border-white/5 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-subtle">Top Performer</p>
                        <h3 className="text-xl font-bold text-cream mt-1">{topPerformer.name}</h3>
                        <p className="text-sm text-text-subtle">{topPerformer.role}</p>
                        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                            <div>
                                <p className="text-xs text-text-subtle">Orders</p>
                                <p className="font-bold text-cream">{topPerformer.ordersCompleted}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle">Rating</p>
                                <p className="font-bold text-cream">{topPerformer.rating}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle">Sales</p>
                                <p className="font-bold text-primary">${topPerformer.salesGenerated.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {staffPerformance.map((member) => (
                        <div key={member.id} className="bg-card-dark rounded-xl border border-white/5 p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-cream">{member.name}</p>
                                    <p className="text-xs text-text-subtle mt-1">{member.role} • {member.shift}</p>
                                </div>
                                <span className="text-xs font-bold text-primary">{member.status}</span>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                                <div className="bg-white/5 rounded-lg p-2">
                                    <p className="text-text-subtle">Orders</p>
                                    <p className="text-cream font-bold mt-1">{member.ordersCompleted}</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-2">
                                    <p className="text-text-subtle">Avg Prep</p>
                                    <p className="text-cream font-bold mt-1">{member.avgPrepTime}</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-2">
                                    <p className="text-text-subtle">Sales</p>
                                    <p className="text-primary font-bold mt-1">${member.salesGenerated.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CampaignBuilderScreen = () => {
    const navigate = useNavigate();
    const { campaigns, adminLoading, adminError, loadCampaigns, saveCampaign } = useStore();

    const [name, setName] = useState('Summer Espresso Deal');
    const [offerType, setOfferType] = useState<'percent' | 'fixed' | 'bogo'>('percent');
    const [discountValue, setDiscountValue] = useState(25);
    const [minPurchase, setMinPurchase] = useState(10);
    const [targetAudience, setTargetAudience] = useState('loyal');
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10));

    useEffect(() => {
        if (!campaigns.length) {
            loadCampaigns();
        }
    }, [campaigns.length, loadCampaigns]);

    const submitCampaign = async (status: 'Draft' | 'Active') => {
        if (!name.trim()) return;
        await saveCampaign({
            name: name.trim(),
            offerType,
            discountValue: offerType === 'bogo' ? 0 : discountValue,
            minPurchase,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            targetAudience,
            status,
        });
        if (status === 'Active') {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Campaign Builder" showBack onBack={() => navigate(-1)} />

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
                {adminError && <p className="text-sm text-red-400">{adminError}</p>}

                <div className="bg-card-dark rounded-xl border border-white/5 p-4 space-y-3">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-subtle">Campaign Name</label>
                        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-subtle">Offer Type</label>
                        <div className="mt-2 flex gap-2">
                            {['percent', 'fixed', 'bogo'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setOfferType(item as typeof offerType)}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold ${offerType === item ? 'bg-primary text-bg-dark' : 'bg-white/5 text-text-subtle border border-white/10'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {offerType !== 'bogo' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-text-subtle">Discount</label>
                                <input type="number" value={discountValue} onChange={(event) => setDiscountValue(Number(event.target.value))} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-text-subtle">Min Purchase</label>
                                <input type="number" value={minPurchase} onChange={(event) => setMinPurchase(Number(event.target.value))} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-subtle">Start Date</label>
                            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-subtle">End Date</label>
                            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-subtle">Audience</label>
                        <input value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                    </div>
                </div>

                <div className="bg-card-dark rounded-xl border border-white/5 p-4">
                    <h3 className="text-sm font-bold text-cream mb-3">Recent Campaigns</h3>
                    <div className="space-y-2">
                        {campaigns.slice(0, 5).map((campaign) => (
                            <div key={campaign.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <div>
                                    <p className="text-sm font-bold text-cream">{campaign.name}</p>
                                    <p className="text-xs text-text-subtle mt-1">{campaign.offerType} • {campaign.targetAudience}</p>
                                </div>
                                <span className="text-xs font-bold text-primary">{campaign.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-white/5 p-4 flex gap-2">
                <button disabled={adminLoading} onClick={() => submitCampaign('Draft')} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-bold">Save Draft</button>
                <button disabled={adminLoading} onClick={() => submitCampaign('Active')} className="flex-1 py-3 rounded-xl bg-primary text-bg-dark font-bold">Launch Campaign</button>
            </div>
        </div>
    );
};

export const NotificationComposerScreen = () => {
    const navigate = useNavigate();
    const { notificationHistory, adminLoading, adminError, loadNotificationHistory, sendNotification } = useStore();

    const [title, setTitle] = useState('Happy Hour');
    const [message, setMessage] = useState('Get 50% off your favorite latte for the next hour.');
    const [audience, setAudience] = useState<NotificationAudience>('all');
    const [delivery, setDelivery] = useState<'now' | 'scheduled'>('now');
    const [scheduledFor, setScheduledFor] = useState(new Date(Date.now() + (60 * 60 * 1000)).toISOString().slice(0, 16));

    useEffect(() => {
        if (!notificationHistory.length) {
            loadNotificationHistory();
        }
    }, [loadNotificationHistory, notificationHistory.length]);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) return;
        const sent = await sendNotification({
            title: title.trim(),
            message: message.trim(),
            audience,
            delivery,
            scheduledFor: delivery === 'scheduled' ? new Date(scheduledFor).toISOString() : undefined,
        });

        if (sent && delivery === 'now') {
            setTitle('');
            setMessage('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Notification Composer" showBack onBack={() => navigate(-1)} />

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
                {adminError && <p className="text-sm text-red-400">{adminError}</p>}

                <div className="bg-card-dark rounded-xl border border-white/5 p-4 space-y-3">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-subtle">Title</label>
                        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={40} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-subtle">Message</label>
                        <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={120} className="mt-1 w-full h-28 rounded-lg bg-bg-dark border border-white/10 p-3 text-cream" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-subtle">Audience</label>
                            <select value={audience} onChange={(event) => setAudience(event.target.value as NotificationAudience)} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream">
                                <option value="all">All Users</option>
                                <option value="loyal">Loyal Customers</option>
                                <option value="inactive">Inactive Users</option>
                                <option value="new">New Signups</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-subtle">Delivery</label>
                            <select value={delivery} onChange={(event) => setDelivery(event.target.value as 'now' | 'scheduled')} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream">
                                <option value="now">Send Now</option>
                                <option value="scheduled">Schedule</option>
                            </select>
                        </div>
                    </div>

                    {delivery === 'scheduled' && (
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-subtle">Scheduled Time</label>
                            <input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} className="mt-1 w-full h-10 rounded-lg bg-bg-dark border border-white/10 px-3 text-cream" />
                        </div>
                    )}

                    <button disabled={adminLoading} onClick={handleSend} className="w-full py-3 rounded-xl bg-primary text-bg-dark font-bold">
                        {delivery === 'now' ? 'Send Notification' : 'Schedule Notification'}
                    </button>
                </div>

                <div className="bg-card-dark rounded-xl border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-cream">Notification History</h3>
                        <button onClick={loadNotificationHistory} className="text-xs font-bold text-primary">Refresh</button>
                    </div>
                    <div className="space-y-2">
                        {notificationHistory.slice(0, 8).map((entry) => (
                            <div key={entry.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-bold text-cream">{entry.title}</p>
                                    <span className="text-[11px] text-primary font-bold">{entry.status}</span>
                                </div>
                                <p className="text-xs text-text-subtle mt-1">{entry.message}</p>
                                <p className="text-[11px] text-text-subtle mt-2">Audience: {entry.audience} • Reach: {entry.targetCount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MenuManagementScreen = () => {
    const { menuItems, adminLoading, adminError, loadMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = useStore();
    const [category, setCategory] = useState('all');

    useEffect(() => {
        if (!menuItems.length) {
            loadMenuItems();
        }
    }, [menuItems.length, loadMenuItems]);

    const categories = useMemo(() => ['all', ...new Set(menuItems.map((item) => item.category))], [menuItems]);

    const filtered = useMemo(() => {
        return category === 'all' ? menuItems : menuItems.filter((item) => item.category === category);
    }, [category, menuItems]);

    const addMenu = async () => {
        const name = window.prompt('Item name');
        if (!name) return;
        const priceRaw = window.prompt('Price', '4.50');
        const price = Number(priceRaw);
        if (Number.isNaN(price)) return;

        const description = window.prompt('Description', 'Freshly brewed') ?? '';
        const categoryValue = window.prompt('Category', 'Hot Coffee') ?? 'Hot Coffee';
        const image = window.prompt('Image URL', '') || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085';

        await createMenuItem({ name, description, price, category: categoryValue, image, isPopular: false });
    };

    const editMenu = async (item: Product) => {
        const priceRaw = window.prompt('Update price', String(item.price));
        if (priceRaw === null) return;
        const price = Number(priceRaw);
        if (Number.isNaN(price)) return;

        const description = window.prompt('Update description', item.description);
        if (description === null) return;

        await updateMenuItem(item.id, { price, description });
    };

    return (
        <div className="h-full flex flex-col bg-bg-dark">
            <Header title="Menu Management" showBack />

            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap ${category === item ? 'bg-primary text-bg-dark' : 'bg-card-dark text-text-subtle border border-white/10'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <button onClick={addMenu} className="text-xs font-bold text-primary">Add Item</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                {adminLoading && !filtered.length && <p className="text-text-subtle">Loading menu...</p>}
                {adminError && <p className="text-sm text-red-400 mb-3">{adminError}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filtered.map((item) => (
                        <div key={item.id} className="bg-card-dark rounded-xl border border-white/5 p-3">
                            <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
                            <div className="mt-3">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-cream">{item.name}</p>
                                    <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
                                </div>
                                <p className="text-xs text-text-subtle mt-1">{item.description}</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => editMenu(item)} className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-cream">Edit</button>
                                <button onClick={() => deleteMenuItem(item.id)} className="py-2 px-3 rounded-lg bg-red-500/20 text-red-400 text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
