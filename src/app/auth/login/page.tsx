'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ id: '', pin: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Artificial delay for futuristic feel
        setTimeout(() => {
            if (credentials.id === 'ADMIN' && credentials.pin === '2026') {
                setStatus('success');
                setTimeout(() => router.push('/authority/dashboard'), 500);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 2000);
            }
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-card p-10 relative overflow-hidden group"
            >
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />

                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 neon-glow-primary border border-primary/30">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Authority Uplink</h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Secure Personnel Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="PERSONNEL ID (ADMIN)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10 uppercase"
                                value={credentials.id}
                                onChange={e => setCredentials({ ...credentials, id: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="password"
                                placeholder="SECURITY PIN (2026)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10"
                                value={credentials.pin}
                                onChange={e => setCredentials({ ...credentials, pin: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full group relative py-4 bg-primary rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3 text-black font-black uppercase text-xs tracking-widest">
                            {status === 'loading' ? (
                                <>Authenticating...</>
                            ) : status === 'error' ? (
                                <span className="text-red-900">Access Denied</span>
                            ) : status === 'success' ? (
                                <span>Welcome, Officer</span>
                            ) : (
                                <>
                                    Establish Link
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                </form>

                <div className="mt-8 flex justify-center gap-6">
                    <div className="flex flex-col items-center">
                        <div className="w-1 h-1 rounded-full bg-primary/40 mb-2" />
                        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Bio-Metric Sync</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-1 h-1 rounded-full bg-primary/40 mb-2" />
                        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">AES-256 Protocol</span>
                    </div>
                </div>
            </motion.div>

            <p className="mt-8 text-[9px] text-white/20 uppercase tracking-[0.4em] font-medium">
                Authorized Use Only • Neural Guard System v4.1
            </p>
        </div>
    );
}
