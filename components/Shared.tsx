import { useLocation, useNavigate } from 'react-router-dom';

export const Button = ({ children, onClick, variant = 'primary', className = '' }: any) => {
  const baseStyle = "w-full py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-bg-dark hover:brightness-110 shadow-lg shadow-primary/20",
    secondary: "bg-white/5 border border-white/10 text-cream hover:bg-white/10",
    ghost: "text-text-subtle hover:text-primary",
    danger: "bg-red-500 text-white"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

export const IconButton = ({ icon, onClick, active = false }: { icon: string, onClick?: () => void, active?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-colors ${active ? 'text-primary' : 'text-text-subtle hover:text-primary'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'font-variation-fill' : ''}`}>{icon}</span>
  </button>
);

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-bg-dark border-t border-white/5 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <IconButton icon="restaurant_menu" active={isActive('/')} onClick={() => navigate('/')} />
        <IconButton icon="shopping_bag" active={isActive('/cart')} onClick={() => navigate('/cart')} />
        <div className="relative -top-5" onClick={() => navigate('/rewards')}>
          <div className="bg-primary p-3 rounded-full shadow-lg shadow-primary/30 border-4 border-bg-dark cursor-pointer transform transition hover:scale-105">
            <span className="material-symbols-outlined text-bg-dark text-3xl">star</span>
          </div>
        </div>
        <IconButton icon="account_balance_wallet" active={isActive('/wallet')} onClick={() => navigate('/wallet')} />
        <IconButton icon="person" active={isActive('/orders')} onClick={() => navigate('/orders')} />
      </div>
    </div>
  );
};

export const Header = ({ title, showBack = false, onBack, rightAction }: any) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/5">
      {showBack ? (
        <button onClick={handleBack} className="flex size-10 items-center justify-center rounded-full active:bg-white/10 text-cream">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
      ) : <div className="size-10" />}

      <h2 className="text-cream text-lg font-bold leading-tight tracking-tight flex-1 text-center">{title}</h2>

      <div className="size-10 flex items-center justify-center">
        {rightAction}
      </div>
    </div>
  );
};
