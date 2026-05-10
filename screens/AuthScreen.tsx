import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IMAGES } from '../constants';

export const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase!.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase!.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                alert('Verification email sent! Check your inbox.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-bg-dark text-cream p-8">
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">local_cafe</span>
                    <span className="font-bold text-2xl tracking-tight">Brew Coffee</span>
                </div>

                <div className="bg-card-dark border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
                    <p className="text-text-subtle text-sm mb-8">
                        {isLogin ? 'Sign in to continue your brew journey' : 'Start earning rewards with every cup'}
                    </p>

                    <form onSubmit={handleAuth} className="flex flex-col gap-4">
                        {!isLogin && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-text-subtle uppercase px-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-text-subtle uppercase px-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-all"
                                placeholder="name@email.com"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-text-subtle uppercase px-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-bg-dark font-bold rounded-xl p-4 mt-4 hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-text-subtle hover:text-primary transition-all"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
