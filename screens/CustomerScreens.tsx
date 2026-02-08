import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button, Header } from '../components/Shared';
import { IMAGES } from '../constants';
import { useProducts } from '../lib/hooks';

// ONBOARDING
export const OnboardingScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/');
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-end pb-12 px-6">
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.latteArt}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col gap-6 items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-4xl">local_cafe</span>
        </div>
        <h1 className="text-4xl font-extrabold text-cream leading-tight">Your daily brew,<br />perfected.</h1>
        <p className="text-text-subtle text-lg">Order ahead and skip the line. Experience coffee craft at its finest.</p>
        <div className="w-full flex flex-col gap-3 mt-4">
          <Button onClick={handleStart}>Get Started</Button>
          <Button variant="secondary">Login</Button>
        </div>
      </div>
    </div>
  );
};

// HOME
export const HomeScreen = () => {
  const navigate = useNavigate();
  const { data: products, loading, error } = useProducts();

  return (
    <div className="pb-24">
      <div className="px-6 py-4 flex justify-between items-center sticky top-0 bg-bg-dark/95 z-20 backdrop-blur">
        <div className="flex items-center gap-3">
          <img src={IMAGES.profile} className="w-12 h-12 rounded-full border-2 border-primary/20" alt="Profile" />
          <div>
            <p className="text-text-subtle text-xs font-bold uppercase tracking-wider">Good morning,</p>
            <h2 className="text-cream text-lg font-bold">Alex</h2>
          </div>
        </div>
        <button className="p-2 bg-white/5 rounded-full relative">
          <span className="material-symbols-outlined text-cream">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-textured-card bg-card-dark rounded-2xl p-6 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">workspace_premium</span></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Gold Member</span>
              <h3 className="text-2xl font-bold text-cream mt-1">Loyalty Points</h3>
            </div>
          </div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-4xl font-bold text-cream">350</span>
            <span className="text-text-subtle mb-1">/ 400 pts</span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[87%]"></div>
          </div>
          <p className="text-xs text-primary mt-2">50 pts to free latte</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/find')} className="bg-card-dark p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
            <span className="text-cream text-xs font-bold">Find Café</span>
          </button>
          <button onClick={() => navigate('/orders')} className="bg-card-dark p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-2xl">history</span>
            <span className="text-cream text-xs font-bold">My Orders</span>
          </button>
          <button onClick={() => navigate('/invite')} className="bg-card-dark p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-2xl">card_giftcard</span>
            <span className="text-cream text-xs font-bold">Invite</span>
          </button>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['All', 'Hot Coffee', 'Iced', 'Pastry'].map((cat, i) => (
            <button key={cat} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap ${i === 0 ? 'bg-primary text-bg-dark' : 'bg-card-dark text-text-subtle'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid with Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 px-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card-dark p-3 rounded-2xl border border-white/5 animate-pulse">
              <div className="aspect-[4/5] mb-3 rounded-xl bg-white/5"></div>
              <div className="h-4 bg-white/5 rounded mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-4 text-center py-8">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
          <p className="text-text-subtle">Failed to load products</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 px-4">
          {products?.map(product => (
            <div
              key={product.id}
              className="bg-card-dark p-3 rounded-2xl border border-white/5 cursor-pointer hover:border-white/20 transition-all"
              onClick={() => navigate('/details', {
                state: {
                  product: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image_url,
                    category: product.category,
                    isPopular: product.is_popular,
                  }
                }
              })}
            >
              <div className="relative aspect-[4/5] mb-3 rounded-xl overflow-hidden">
                <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} />
                {product.is_popular && <span className="absolute top-2 left-2 bg-primary text-bg-dark text-[10px] font-bold px-2 py-1 rounded">HOT</span>}
                <button className="absolute bottom-2 right-2 bg-black/50 backdrop-blur p-1.5 rounded-full text-white">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <h3 className="text-cream font-bold truncate">{product.name}</h3>
              <p className="text-text-subtle text-xs truncate">{product.description}</p>
              <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// DETAILS
export const DetailsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useStore();
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');

  // Get Product from Router State or Fallback
  const defaultProduct = {
    id: '0',
    name: 'Coffee',
    description: 'Delicious coffee',
    price: 4.50,
    image: IMAGES.cappuccino,
    category: 'Hot Coffee',
    isPopular: false,
  };
  const product = location.state?.product || defaultProduct;

  const handleAddToCart = () => {
    addToCart(product, 1, size, []);
    navigate('/cart');
  };

  return (
    <div className="pb-24 bg-bg-dark min-h-screen">
      <div className="relative h-80">
        <img src={product.image} className="w-full h-full object-cover" alt="Detail" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur rounded-full text-white">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-cream">{product.name}</h1>
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-text-subtle leading-relaxed text-sm mb-6">{product.description}</p>

        <h3 className="text-sm font-bold text-text-subtle uppercase tracking-widest mb-3">Size</h3>
        <div className="flex gap-4 mb-6">
          {['S', 'M', 'L'].map(s => (
            <button key={s}
              onClick={() => setSize(s as 'S' | 'M' | 'L')}
              className={`flex-1 h-12 rounded-xl font-bold border ${size === s ? 'bg-primary text-bg-dark border-primary' : 'border-white/10 text-text-subtle'}`}>
              {s}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-bold text-text-subtle uppercase tracking-widest mb-3">Sweetness</h3>
        <input type="range" className="w-full accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mb-8" />

        <h3 className="text-sm font-bold text-text-subtle uppercase tracking-widest mb-3">Add-ons</h3>
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex justify-between items-center p-3 bg-card-dark rounded-xl border border-white/5">
            <span className="text-cream font-medium">Extra Shot</span>
            <input type="checkbox" className="accent-primary w-5 h-5 rounded" />
          </div>
        </div>

        <Button onClick={handleAddToCart}>Add to Cart - ${product.price.toFixed(2)}</Button>
      </div>
    </div>
  )
};

// TRACK ORDER
export const TrackOrderScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col">
      <Header title="Track Order" showBack />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="text-center mb-8">
          <p className="text-text-subtle text-sm uppercase tracking-widest font-bold">Estimated Pickup</p>
          <h1 className="text-5xl font-extrabold text-cream mt-2">10:45 AM</h1>
          <p className="text-primary font-bold mt-2 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span> On time
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-white/10 space-y-10 mb-8">
          {[
            { title: "Order Confirmed", time: "10:32 AM", done: true },
            { title: "Preparing", time: "Barista is working", done: true, active: true },
            { title: "Ready for Pickup", time: "Est. 10:45 AM", done: false }
          ].map((step, i) => (
            <div key={i} className="relative">
              <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-bg-dark ${step.done ? 'bg-primary' : 'bg-white/10'}`}></div>
              <h3 className={`text-lg font-bold ${step.active ? 'text-primary' : 'text-cream'}`}>{step.title}</h3>
              <p className="text-text-subtle text-sm">{step.time}</p>
            </div>
          ))}
        </div>

        <div className="bg-card-dark rounded-2xl p-4 border border-white/5">
          <div className="h-32 w-full bg-cover bg-center rounded-xl mb-4 relative overflow-hidden" style={{ backgroundImage: `url('${IMAGES.map}')` }}>
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-lg">
              <span className="material-symbols-outlined text-4xl">location_on</span>
            </div>
          </div>
          <h3 className="font-bold text-cream">Bean & Brew Downtown</h3>
          <p className="text-text-subtle text-sm">123 Main St, Seattle, WA</p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="bg-white p-4 rounded-xl">
            <img src={IMAGES.qr} className="w-32 h-32 opacity-90 mix-blend-multiply" alt="QR" />
          </div>
        </div>
        <p className="text-center text-text-subtle text-xs mt-2">Scan at counter</p>
      </div>
    </div>
  );
};

// WALLET
export const WalletScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col">
      <Header title="My Wallet" showBack />
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-[#3d2b1f] to-[#1a120b] p-6 rounded-2xl shadow-xl border border-white/10 mb-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-white/5"><span className="material-symbols-outlined text-9xl">coffee</span></div>
          <p className="text-text-subtle font-medium mb-1">Current Balance</p>
          <h1 className="text-4xl font-bold text-cream">245 <span className="text-primary text-2xl">Credits</span></h1>
          <p className="text-xs text-text-subtle mt-4 font-mono">ID: 8821-4492</p>
        </div>

        <h3 className="text-lg font-bold text-cream mb-4">Quick Top Up</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[10, 25, 50].map(amt => (
            <button key={amt} className="py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-primary hover:text-bg-dark hover:border-primary font-bold transition-all">
              ${amt}
            </button>
          ))}
        </div>
        <Button>Add Funds</Button>

        <h3 className="text-lg font-bold text-cream mt-8 mb-4">History</h3>
        <div className="space-y-3">
          {[
            { title: "Reload via Apple Pay", amount: "+$20.00", date: "Today" },
            { title: "Morning Latte", amount: "-$4.50", date: "Yesterday" },
            { title: "Croissant", amount: "-$3.75", date: "Oct 12" }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-card-dark rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${item.amount.startsWith('+') ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-text-subtle'}`}>
                  <span className="material-symbols-outlined text-sm">{item.amount.startsWith('+') ? 'add' : 'remove'}</span>
                </div>
                <div>
                  <p className="font-bold text-cream text-sm">{item.title}</p>
                  <p className="text-xs text-text-subtle">{item.date}</p>
                </div>
              </div>
              <span className={`font-bold ${item.amount.startsWith('+') ? 'text-green-500' : 'text-cream'}`}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// INVITE
export const InviteScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col">
      <Header title="Invite Friends" showBack />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full aspect-video rounded-2xl bg-cover bg-center mb-8 relative overflow-hidden" style={{ backgroundImage: `url('${IMAGES.friendToast}')` }}>
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        </div>
        <h1 className="text-3xl font-bold text-cream mb-2">Give a coffee,<br /><span className="text-primary">get 50 points</span></h1>
        <p className="text-text-subtle mb-8">Invite a friend to join. They get a free latte on their first order, and you earn points.</p>

        <div className="w-full bg-card-dark p-4 rounded-xl border border-white/5 flex justify-between items-center mb-8">
          <span className="font-mono text-xl text-cream font-bold tracking-widest">COFFEE-88</span>
          <button className="text-primary font-bold uppercase text-sm">Copy</button>
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">
          {['sms', 'mail', 'content_copy', 'share'].map((icon, i) => (
            <button key={i} className="aspect-square rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-cream">{icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
