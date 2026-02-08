import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Shared';
import { STAFF, INVENTORY, IMAGES } from '../constants';

// DASHBOARD
export const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="pb-24 h-full overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto">
                <header className="mb-6">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Overview</p>
                    <h1 className="text-3xl font-bold text-cream">Good Morning, Alex 👋</h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Stats */}
                    <div className="p-6 bg-card-dark rounded-2xl border border-white/5 md:col-span-1">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-text-subtle text-sm">Today's Revenue</span>
                            <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded font-bold">+8.4%</span>
                        </div>
                        <h2 className="text-4xl font-bold text-cream">$1,240.50</h2>
                        <p className="text-xs text-text-subtle mt-4">vs $1,143.00 yesterday</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="p-5 bg-primary text-bg-dark rounded-2xl flex flex-col justify-between">
                            <span className="material-symbols-outlined text-3xl mb-2">coffee_maker</span>
                            <div>
                                <h3 className="text-4xl font-bold">12</h3>
                                <p className="font-bold text-xs uppercase opacity-80">Active Orders</p>
                            </div>
                        </div>
                        <div className="p-5 bg-card-dark border border-white/5 rounded-2xl flex flex-col justify-between">
                            <span className="material-symbols-outlined text-3xl text-text-subtle mb-2">group</span>
                            <div>
                                <h3 className="text-4xl font-bold text-cream">156</h3>
                                <p className="text-text-subtle font-bold text-xs uppercase">Customers</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Recent Activity */}
                    <div>
                        <h3 className="text-lg font-bold text-cream mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Sarah J.', item: '2x Cappuccino', status: 'Preparing', color: 'text-primary' },
                                { name: 'Mike T.', item: 'Double Espresso', status: 'Ready', color: 'text-green-500' },
                                { name: 'Linda K.', item: 'Blueberry Muffin', status: 'Pending', color: 'text-text-subtle' },
                                { name: 'Tom H.', item: 'Iced Latte', status: 'Completed', color: 'text-text-subtle' },
                            ].map((order, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-card-dark rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-cream">receipt</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-cream">{order.name}</h4>
                                        <p className="text-xs text-text-subtle">{order.item}</p>
                                    </div>
                                    <span className={`text-xs font-bold uppercase ${order.color} border border-white/10 px-2 py-1 rounded`}>{order.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions (Admin Only) */}
                    <div>
                        <h3 className="text-lg font-bold text-cream mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => navigate('/')} className="p-4 bg-card-dark border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="text-sm font-bold text-cream">New Order</span>
                            </button>
                            <button onClick={() => navigate('/admin/campaign')} className="p-4 bg-card-dark border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">campaign</span>
                                <span className="text-sm font-bold text-cream">Create Promo</span>
                            </button>
                            <button onClick={() => navigate('/admin/inventory')} className="p-4 bg-card-dark border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">inventory</span>
                                <span className="text-sm font-bold text-cream">Update Stock</span>
                            </button>
                            <button onClick={() => navigate('/admin/staff')} className="p-4 bg-card-dark border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">person_add</span>
                                <span className="text-sm font-bold text-cream">Add Staff</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// INVENTORY
export const AdminInventory = () => (
    <div className="pb-24 h-full overflow-y-auto">
        <Header title="Inventory" />
        <div className="px-4 py-4 max-w-7xl mx-auto w-full">
            <h3 className="text-lg font-bold text-cream mb-4">Critical Alerts</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 pb-2">
                {INVENTORY.filter(i => i.status !== 'Healthy').map(item => (
                    <div key={item.id} className="min-w-[260px] bg-card-dark p-4 rounded-xl border-l-4 border-red-500 shadow-lg relative overflow-hidden flex-1 max-w-sm">
                        <div className="flex gap-4">
                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-white/5" alt={item.name} />
                            <div>
                                <h4 className="font-bold text-cream">{item.name}</h4>
                                <p className="text-red-500 text-sm font-bold">{item.quantity}</p>
                                <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500/30 transition-colors">Order Now</button>
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-bold text-cream mb-4">All Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {INVENTORY.map(item => (
                    <div key={item.id} className="bg-card-dark p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="relative aspect-square mb-3">
                            <img src={item.image} className="w-full h-full object-cover rounded-lg" alt={item.name} />
                            <span className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">{item.quantity}</span>
                        </div>
                        <h4 className="text-sm font-bold text-cream truncate">{item.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] uppercase text-text-subtle">{item.category}</span>
                            <span className="text-xs font-bold text-primary">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                            <div className={`h-full rounded-full ${item.percentage < 30 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// STAFF
export const AdminStaff = () => (
    <div className="pb-24">
        <Header title="Staff Management" rightAction={<div className="bg-white/10 rounded-full p-1"><img src={IMAGES.profile} className="w-8 h-8 rounded-full" /></div>} />

        <div className="px-4 py-4">
            <div className="relative mb-6">
                <span className="absolute left-3 top-3.5 text-text-subtle material-symbols-outlined">search</span>
                <input type="text" placeholder="Search employee..." className="w-full bg-card-dark border border-white/5 rounded-xl py-3 pl-10 text-cream placeholder:text-text-subtle focus:outline-none focus:border-primary" />
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                <button className="px-4 py-2 bg-primary text-bg-dark rounded-full text-xs font-bold">All Roles</button>
                <button className="px-4 py-2 border border-white/10 text-text-subtle rounded-full text-xs font-bold">Active</button>
                <button className="px-4 py-2 border border-white/10 text-text-subtle rounded-full text-xs font-bold">On Shift</button>
            </div>

            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-subtle">Roster • 12 Staff</h3>
            </div>

            <div className="space-y-3">
                {STAFF.map(staff => (
                    <div key={staff.id} className="bg-card-dark p-4 rounded-xl border border-white/5 flex items-center gap-4">
                        {staff.image ? (
                            <img src={staff.image} className="w-12 h-12 rounded-full object-cover border border-white/10" alt={staff.name} />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-cream">{staff.name.charAt(0)}</div>
                        )}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-cream">{staff.name}</h4>
                                <button className="text-text-subtle"><span className="material-symbols-outlined">more_horiz</span></button>
                            </div>
                            <p className="text-xs text-text-subtle uppercase tracking-wider mb-2">{staff.role}</p>
                            <div className="flex gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${staff.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : staff.status === 'On Shift' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-text-subtle border-white/10'}`}>● {staff.status}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-subtle border border-white/10 flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">schedule</span> {staff.shift}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
        </button>
    </div>
);