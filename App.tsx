import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { ScreenName } from './types';
import { BottomNav } from './components/Shared';
import { OnboardingScreen, HomeScreen, DetailsScreen, TrackOrderScreen, WalletScreen, InviteScreen } from './screens/CustomerScreens';
import { AdminDashboard, AdminInventory, AdminStaff } from './screens/AdminScreens';
import { IMAGES } from './constants';

// Phase 1: Customer Features
import { StoreLocatorScreen, CheckoutScreen, OrderHistoryScreen, RewardsScreen } from './screens/Phase1Screens';
// Phase 2: Admin Operations
import { LiveQueueScreen, AnalyticsScreen, FeedbackScreen } from './screens/Phase2Screens';
// Phase 3: Advanced Features
import { StaffPerformanceScreen, CampaignBuilderScreen, NotificationComposerScreen, MenuManagementScreen } from './screens/Phase3Screens';

const App = () => {
  const { isAdminMode, toggleAdminMode } = useStore();
  const navigate = useNavigate();
  const location = useLocation();



  // Sync Admin Mode state with URL if needed, or just use state.
  // For now, state drives the layout.

  // Restore scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Sidebar Item
  const SidebarNavItem = ({ path, icon, label }: { path: string; icon: string; label: string }) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active
          ? 'bg-primary text-bg-dark font-bold shadow-md'
          : 'text-text-subtle hover:bg-white/5 hover:text-cream'
          }`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className={`mx-auto bg-bg-dark min-h-screen relative shadow-2xl overflow-hidden transition-all duration-300 ${isAdminMode ? 'w-full' : 'max-w-md'}`}>

      {/* Admin Toggle */}
      <div className="fixed top-6 right-6 z-[60]">
        <button
          onClick={() => {
            toggleAdminMode();
            if (!isAdminMode) {
              navigate('/admin/dashboard');
            } else {
              navigate('/');
            }
          }}
          className={`bg-white/10 backdrop-blur text-xs px-3 py-1.5 rounded-full text-white border border-white/10 hover:bg-white/20 transition-all ${isAdminMode ? 'shadow-none' : ''}`}
        >
          {isAdminMode ? 'Switch to Customer App' : 'Switch to Admin App'}
        </button>
      </div>

      <div className={`flex h-screen ${isAdminMode ? 'flex-row' : 'flex-col'}`}>
        {/* Admin Sidebar */}
        {isAdminMode && (
          <div className="hidden md:flex w-64 flex-col border-r border-white/5 bg-card-dark p-4 shrink-0 z-50">
            <div className="flex items-center gap-2 px-2 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">local_cafe</span>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-cream leading-tight">Brew Coffee</span>
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Admin</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs font-bold text-text-subtle uppercase tracking-wider px-2 mb-2 mt-2">Overview</p>
              <SidebarNavItem path="/admin/dashboard" icon="dashboard" label="Dashboard" />
              <SidebarNavItem path="/admin/queue" icon="list_alt" label="Live Queue" />
              <SidebarNavItem path="/admin/inventory" icon="inventory_2" label="Inventory" />

              <p className="text-xs font-bold text-text-subtle uppercase tracking-wider px-2 mb-2 mt-6">Management</p>
              <SidebarNavItem path="/admin/staff" icon="group" label="Staff" />
              <SidebarNavItem path="/admin/feedback" icon="reviews" label="Feedback" />
              <SidebarNavItem path="/admin/campaign" icon="campaign" label="Campaigns" />
              <SidebarNavItem path="/admin/notification" icon="notifications" label="Notifications" />
              <SidebarNavItem path="/admin/menu" icon="restaurant_menu" label="Menu" />
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-2">
                <img src={IMAGES.profile} className="w-8 h-8 rounded-full border border-white/10" alt="Admin" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-cream">Admin User</span>
                  <span className="text-xs text-text-subtle">Store Manager</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/details" element={<DetailsScreen />} />
            <Route path="/track-order" element={<TrackOrderScreen />} />
            <Route path="/wallet" element={<WalletScreen />} />
            <Route path="/invite" element={<InviteScreen />} />

            <Route path="/find" element={<StoreLocatorScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/orders" element={<OrderHistoryScreen />} />
            <Route path="/rewards" element={<RewardsScreen />} />

            <Route path="/cart" element={
              <div className="h-screen flex flex-col bg-bg-dark text-cream">
                <div className="p-4 flex items-center"><button onClick={() => navigate(-1)}><span className="material-symbols-outlined">arrow_back</span></button><h2 className="ml-4 font-bold">Cart</h2></div>
                <div className="flex-1 flex items-center justify-center flex-col">
                  <span className="material-symbols-outlined text-6xl text-white/10">shopping_cart</span>
                  <p className="mt-4 text-text-subtle">Items added...</p>
                  <button onClick={() => navigate('/checkout')} className="mt-8 bg-primary text-black px-8 py-3 rounded-xl font-bold">Checkout</button>
                </div>
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/queue" element={<LiveQueueScreen />} />
            <Route path="/admin/feedback" element={<FeedbackScreen />} />
            <Route path="/admin/campaign" element={<CampaignBuilderScreen />} />
            <Route path="/admin/notification" element={<NotificationComposerScreen />} />
            <Route path="/admin/menu" element={<MenuManagementScreen />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Customer Bottom Nav */}
      {!isAdminMode && ['/', '/cart', '/wallet', '/rewards', '/orders'].includes(location.pathname) && (
        <BottomNav />
      )}

      {/* Admin Mobile Nav */}
      {isAdminMode && (
        <div className="md:hidden fixed bottom-0 w-full bg-bg-dark border-t border-white/5 z-50 pb-6 pt-2">
          <div className="flex justify-around items-center h-16 px-2">
            <button onClick={() => navigate('/admin/dashboard')} className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/dashboard' ? 'text-primary' : 'text-text-subtle'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => navigate('/admin/queue')} className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/queue' ? 'text-primary' : 'text-text-subtle'}`}>
              <span className="material-symbols-outlined">list_alt</span>
              <span className="text-[10px] font-bold">Queue</span>
            </button>
            <button onClick={() => navigate('/admin/inventory')} className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/inventory' ? 'text-primary' : 'text-text-subtle'}`}>
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-[10px] font-bold">Stock</span>
            </button>
            <button onClick={() => navigate('/admin/staff')} className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/staff' ? 'text-primary' : 'text-text-subtle'}`}>
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-bold">Staff</span>
            </button>
            <button onClick={() => navigate('/admin/feedback')} className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/feedback' ? 'text-primary' : 'text-text-subtle'}`}>
              <span className="material-symbols-outlined">reviews</span>
              <span className="text-[10px] font-bold">Reviews</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
