import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Shared';
import { PRODUCTS, IMAGES } from '../constants';

// STAFF PERFORMANCE ANALYTICS
export const StaffPerformanceScreen = () => {
    const navigate = useNavigate();

    const topPerformer = {
        name: 'Sarah Jenkins',
        branch: 'Main Street Branch',
        orders: 342,
        rating: 4.9,
        sales: 4285.50,
        image: IMAGES.staff1,
    };

    const teamMetrics = [
        { name: 'Mike Thompson', role: 'Senior Barista', orders: 120, rating: 4.8, avgPrepTime: '3m 12s', sales: 1940, avatar: IMAGES.staff2 },
        { name: 'Jessica Lee', role: 'Barista', orders: 98, rating: 4.5, avgPrepTime: '4m 05s', sales: 1250, avatar: IMAGES.staff3 },
        { name: 'David Chen', role: 'Trainee', orders: 45, rating: 4.2, avgPrepTime: '5m 10s', sales: 620, avatar: '' },
    ];

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between bg-bg-dark/95 backdrop-blur-md p-4 border-b border-white/5">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 text-cream transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold text-cream">Performance</h1>
                    <button className="relative flex size-10 items-center justify-center rounded-full hover:bg-white/5 text-cream transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 rounded-full bg-primary border border-bg-dark"></span>
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-bg-dark border-b border-white/5">
                <div className="max-w-7xl mx-auto flex gap-3 px-4 py-4">
                    <div className="flex-1 relative max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-text-subtle text-[20px]">calendar_month</span>
                        </div>
                        <input
                            className="block w-full rounded-lg bg-card-dark border border-white/10 py-2.5 pl-10 pr-3 text-sm text-cream focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            readOnly
                            value="Oct 1 - Oct 31, 2023"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="material-symbols-outlined text-text-subtle text-[20px]">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto pb-24 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Performer Card */}
                        <section>
                            <div className="flex items-center justify-between mb-3 mt-2">
                                <h2 className="text-xl font-bold text-cream">Top Performer</h2>
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Month of October</span>
                            </div>
                            <div className="overflow-hidden rounded-xl bg-card-dark border border-white/5 shadow-sm hover:border-white/10 transition-colors">
                                <div className="flex p-4 gap-4">
                                    <div className="flex-1 flex flex-col justify-center gap-1">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="material-symbols-outlined text-primary text-[18px]">trophy</span>
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">#1 Barista</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-cream">{topPerformer.name}</h3>
                                        <p className="text-text-subtle text-sm">{topPerformer.branch}</p>
                                        <div className="mt-3 flex items-center gap-4">
                                            <div>
                                                <p className="text-xs text-text-subtle">Orders</p>
                                                <p className="text-base font-bold text-cream">{topPerformer.orders}</p>
                                            </div>
                                            <div className="w-px h-8 bg-white/10"></div>
                                            <div>
                                                <p className="text-xs text-text-subtle">Rating</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-base font-bold text-cream">{topPerformer.rating}</span>
                                                    <span className="material-symbols-outlined text-primary text-[16px]">star</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="w-24 shrink-0 rounded-lg bg-center bg-cover shadow-inner"
                                        style={{ backgroundImage: `url('${topPerformer.image}')` }}
                                    ></div>
                                </div>
                                <div className="bg-primary/10 px-4 py-2 flex justify-between items-center border-t border-white/5">
                                    <span className="text-xs text-text-subtle font-medium">Total Sales Generated</span>
                                    <span className="text-sm font-bold text-primary">${topPerformer.sales.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        {/* Prep Time Chart */}
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-cream">Prep Time Efficiency</h2>
                                <button className="text-xs text-primary font-medium flex items-center hover:underline">
                                    View Details <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                </button>
                            </div>
                            <div className="rounded-xl border border-white/5 bg-card-dark p-6 hover:border-white/10 transition-colors h-full">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-sm text-text-subtle font-medium">Avg Prep Time</p>
                                        <p className="text-2xl font-bold text-cream mt-1">3m 45s</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded text-green-400 text-xs font-bold">
                                        <span className="material-symbols-outlined text-[14px]">trending_down</span>
                                        12s faster
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="grid grid-cols-3 gap-6 h-32 items-end px-2">
                                    {[
                                        { label: 'Morning', height: 45 },
                                        { label: 'Lunch', height: 75 },
                                        { label: 'Evening', height: 30 },
                                    ].map((bar) => (
                                        <div key={bar.label} className="flex flex-col items-center gap-2 group cursor-default">
                                            <div className="w-full bg-white/5 rounded-t-sm relative h-full flex items-end overflow-hidden">
                                                <div className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300" style={{ height: `${bar.height}%` }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-text-subtle group-hover:text-cream transition-colors">{bar.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Team Metrics */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-cream">Team Metrics</h2>
                            <div className="flex items-center gap-1 text-xs text-text-subtle">
                                <span>Sort by:</span>
                                <span className="text-cream font-medium">Rating</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamMetrics.map((member, idx) => (
                                <div key={idx} className="flex flex-col gap-3 rounded-xl border border-white/5 bg-card-dark p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="size-10 rounded-full bg-cover bg-center border border-white/10 bg-primary/20 flex items-center justify-center"
                                                style={{ backgroundImage: member.avatar ? `url('${member.avatar}')` : undefined }}
                                            >
                                                {!member.avatar && <span className="text-cream font-bold">{member.name.charAt(0)}</span>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-cream">{member.name}</p>
                                                <p className="text-xs text-text-subtle">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-primary">
                                                <span className="text-sm font-bold">{member.rating}</span>
                                                <span className="material-symbols-outlined text-[16px]">star</span>
                                            </div>
                                            <span className="text-xs text-text-subtle">{member.orders} Orders</span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 w-full"></div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-text-subtle">
                                            <span className="material-symbols-outlined text-[16px]">timer</span>
                                            <span>Avg: <span className="text-cream font-medium">{member.avgPrepTime}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-text-subtle">
                                            <span className="material-symbols-outlined text-[16px]">payments</span>
                                            <span>Sales: <span className="text-cream font-medium">${member.sales.toLocaleString()}</span></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

// CAMPAIGN BUILDER
export const CampaignBuilderScreen = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [offerType, setOfferType] = useState<'percent' | 'fixed' | 'bogo'>('percent');
    const [discountValue, setDiscountValue] = useState(25);

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between bg-bg-dark/95 backdrop-blur-md p-4 border-b border-white/5 shadow-sm">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-cream flex size-10 items-center justify-center hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h2 className="text-cream text-base font-bold">Campaign Builder</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {/* Progress */}
                    <div className="py-2 mb-6 max-w-3xl mx-auto">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <React.Fragment key={s}>
                                    <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 ${s <= step ? 'bg-primary text-bg-dark' : 'bg-white/10 text-text-subtle'
                                        }`}>
                                        {s}
                                    </div>
                                    {s < 3 && <div className={`flex-1 h-1 rounded transition-colors duration-500 ${s < step ? 'bg-primary' : 'bg-white/10'}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-xs text-text-subtle font-medium">Offer</span>
                            <span className="text-xs text-text-subtle font-medium">Schedule</span>
                            <span className="text-xs text-text-subtle font-medium">Audience</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto pb-32">
                        {/* Left Column: Form */}
                        <div className="space-y-6">
                            {/* Campaign Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-subtle">Internal Campaign Name</label>
                                <input
                                    className="w-full h-12 px-4 rounded-lg bg-card-dark border border-white/10 text-cream placeholder-text-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. Summer Morning Boost"
                                    defaultValue="Summer Espresso Deal"
                                />
                            </div>

                            {/* Offer Type */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-subtle">Offer Type</label>
                                <div className="flex p-1 bg-card-dark rounded-lg border border-white/10">
                                    {[
                                        { key: 'percent', label: '% Off' },
                                        { key: 'fixed', label: '$ Off' },
                                        { key: 'bogo', label: 'BOGO' },
                                    ].map((t) => (
                                        <button
                                            key={t.key}
                                            onClick={() => setOfferType(t.key as any)}
                                            className={`flex-1 py-2 px-3 text-sm font-medium rounded text-center transition-all ${offerType === t.key
                                                ? 'bg-surface-dark text-primary shadow-sm font-bold'
                                                : 'text-text-subtle hover:text-cream hover:bg-white/5'
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Value */}
                            {offerType !== 'bogo' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-subtle">
                                        Discount Value ({offerType === 'percent' ? '%' : '$'})
                                    </label>
                                    <input
                                        type="number"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                                        className="w-full h-12 px-4 rounded-lg bg-card-dark border border-white/10 text-cream focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            )}

                            {/* Min Purchase */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-subtle">Minimum Purchase ($)</label>
                                <input
                                    type="number"
                                    defaultValue={5}
                                    className="w-full h-12 px-4 rounded-lg bg-card-dark border border-white/10 text-cream focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Right Column: Preview */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-text-subtle">Live Preview</label>
                            <div className="sticky top-4">
                                <div className="bg-gradient-to-r from-[#3d2b1f] to-[#2c1f15] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-9xl">local_offer</span>
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10 py-6">
                                        <div className="bg-primary/20 p-4 rounded-full border border-primary/10">
                                            <span className="material-symbols-outlined text-primary text-3xl">local_offer</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-cream text-2xl mb-1">
                                                {offerType === 'bogo' ? 'Buy One Get One Free!' : `${discountValue}${offerType === 'percent' ? '%' : '$'} Off Your Order`}
                                            </h4>
                                            <p className="text-sm text-text-subtle font-medium">Limited time offer for loyal customers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 p-6 rounded-2xl bg-card-dark border border-white/5">
                                    <h3 className="font-bold text-cream mb-2">Campaign Summary</h3>
                                    <ul className="space-y-2 text-sm text-text-subtle">
                                        <li className="flex justify-between">
                                            <span>Type:</span> <span className="text-cream capitalize">{offerType === 'bogo' ? 'Buy One Get One' : offerType}</span>
                                        </li>
                                        {offerType !== 'bogo' && (
                                            <li className="flex justify-between">
                                                <span>Value:</span> <span className="text-cream">{discountValue}{offerType === 'percent' ? '%' : '$'}</span>
                                            </li>
                                        )}
                                        <li className="flex justify-between">
                                            <span>Est. Reach:</span> <span className="text-cream">1,240 Users</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-white/5 p-4 z-50">
                <div className="max-w-7xl mx-auto flex justify-end gap-3">
                    <button className="h-12 px-8 rounded-xl bg-white/5 text-cream font-bold hover:bg-white/10 transition-colors">
                        Save Draft
                    </button>
                    <button className="h-12 px-10 rounded-xl bg-primary text-bg-dark font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        Next Step →
                    </button>
                </div>
            </div>
        </div>
    );
};

// PUSH NOTIFICATION COMPOSER
export const NotificationComposerScreen = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("Happy Hour! ☕️");
    const [message, setMessage] = useState("Get 50% off your favorite latte when you order within the next hour.");
    const [audience, setAudience] = useState('all');

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/5 shadow-sm">
                <div className="max-w-7xl mx-auto w-full px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-text-subtle hover:text-cream transition-colors">Cancel</button>
                    <h2 className="text-base font-bold text-cream">New Notification</h2>
                    <button className="bg-primary hover:brightness-110 text-bg-dark px-6 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        Send
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-24 h-full">
                    {/* Left Column: Live Preview */}
                    <section className="flex flex-col gap-3 lg:order-1 h-full">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-sm font-bold text-text-subtle uppercase tracking-wider">Preview</h3>
                            <span className="text-xs text-primary font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                iOS Lock Screen
                            </span>
                        </div>

                        {/* Mockup */}
                        <div className="relative overflow-hidden rounded-3xl bg-gray-900 border border-white/10 shadow-2xl h-[500px] lg:h-full lg:max-h-[600px] flex items-center justify-center bg-cover bg-center"
                            style={{ backgroundImage: `url('${IMAGES.latteArt}')` }}>
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                            {/* Notification Item */}
                            <div className="relative z-10 w-full max-w-xs mx-auto">
                                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="bg-black/80 rounded-lg p-1.5 border border-white/10">
                                            <span className="material-symbols-outlined text-primary text-sm">coffee</span>
                                        </div>
                                        <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">BREW & CO</span>
                                        <span className="text-xs text-white/60 ml-auto">now</span>
                                    </div>
                                    <div className="pl-1">
                                        <p className="text-sm font-bold text-white mb-1 leading-tight">{title || 'Notification Title'}</p>
                                        <p className="text-xs text-white/90 leading-relaxed line-clamp-3">{message || 'Your message will appear here...'}</p>
                                    </div>
                                </div>
                                <div className="mt-8 text-center">
                                    <p className="text-white/40 text-xs font-medium">Slide to view</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Form */}
                    <section className="flex flex-col gap-6 lg:order-2 lg:bg-card-dark lg:p-8 lg:rounded-2xl lg:border lg:border-white/5 lg:h-fit">
                        {/* Title */}
                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <span className="text-sm font-semibold text-text-subtle">Title</span>
                                <span className="text-xs text-text-subtle">{title.length}/40</span>
                            </div>
                            <input
                                className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-cream placeholder-text-subtle focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g., Morning Brew Alert"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={40}
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <span className="text-sm font-semibold text-text-subtle">Message</span>
                                <span className="text-xs text-text-subtle">{message.length}/120</span>
                            </div>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-cream placeholder-text-subtle focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none h-32 custom-scrollbar"
                                    placeholder="Type your notification message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={120}
                                ></textarea>
                                {/* Emoji Toolbar */}
                                <div className="absolute bottom-3 right-3 flex gap-2">
                                    {['☕️', '🥐', '🔥', '👋', '🎉'].map((emoji) => (
                                        <button key={emoji} className="text-lg hover:scale-125 transition-transform bg-white/5 hover:bg-white/10 p-1 rounded" onClick={() => setMessage(m => m + emoji)}>
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full"></div>

                        {/* Audience */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                                <span className="text-sm font-bold text-cream">Target Audience</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { key: 'all', label: 'All Users' },
                                    { key: 'loyal', label: 'Loyal Customers' },
                                    { key: 'inactive', label: 'Inactive (>30 days)' },
                                    { key: 'new', label: 'New Signups' },
                                ].map((a) => (
                                    <button
                                        key={a.key}
                                        onClick={() => setAudience(a.key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${audience === a.key
                                            ? 'bg-primary text-bg-dark font-bold shadow-lg shadow-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-bg-dark'
                                            : 'bg-bg-dark border border-white/10 text-text-subtle hover:bg-white/5'
                                            }`}
                                    >
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full"></div>

                        {/* Delivery */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[20px]">schedule_send</span>
                                <span className="text-sm font-bold text-cream">Delivery</span>
                            </div>
                            <div className="bg-bg-dark p-1 rounded-xl flex border border-white/10">
                                <button className="flex-1 bg-white/10 text-cream shadow-sm rounded-lg py-2 text-sm font-bold transition-colors">
                                    Send Now
                                </button>
                                <button className="flex-1 text-text-subtle hover:text-cream py-2 text-sm font-medium transition-colors">
                                    Schedule
                                </button>
                            </div>
                            <p className="text-xs text-text-subtle px-1">
                                Notification will be sent immediately to approx <span className="text-primary font-bold">1,240</span> users.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

// MENU MANAGEMENT
export const MenuManagementScreen = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<string>('all');

    const categories = ['all', 'Hot Coffee', 'Iced Coffee', 'Tea', 'Seasonal', 'Pastries'];

    return (
        <div className="h-full flex flex-col bg-bg-dark overflow-hidden">
            <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/5 shadow-sm">
                <Header title="Manage Menu" showBack />
            </div>

            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-7xl mx-auto pb-24 h-full">
                    {/* Category Filter */}
                    <div className="sticky top-0 z-40 bg-bg-dark/95 backdrop-blur-sm -mx-4 px-4 py-4 mb-4 border-b border-white/5">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                                        ? 'bg-primary text-bg-dark font-bold shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-white/5 border border-white/5 text-text-subtle hover:bg-white/10 hover:text-cream'
                                        }`}
                                >
                                    {cat === 'all' ? 'All Items' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {PRODUCTS
                            .filter(p => category === 'all' || p.category === category)
                            .map((product) => (
                                <div key={product.id} className="group bg-card-dark rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col gap-4 h-full">
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-black/20">
                                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="size-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary hover:text-bg-dark transition-colors">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button className="size-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-cream text-lg leading-tight">{product.name}</h4>
                                                <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-sm">${product.price.toFixed(2)}</span>
                                            </div>
                                            <p className="text-sm text-text-subtle line-clamp-2">{product.description}</p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-subtle">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">category</span>
                                                {product.category}
                                            </span>
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                                                <span className="size-2 rounded-full bg-green-500"></span>
                                                In Stock
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* Add New Item Card */}
                        <button className="border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-4 text-text-subtle hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[300px] group">
                            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">add</span>
                            </div>
                            <span className="font-bold text-lg">Add New Item</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Floating Action Button (Mobile Only) */}
            <button className="md:hidden fixed bottom-6 right-6 size-14 rounded-full bg-primary text-bg-dark shadow-xl flex items-center justify-center hover:brightness-110 z-50">
                <span className="material-symbols-outlined text-2xl">add</span>
            </button>
        </div>
    );
};
