'use client'

import { motion } from 'framer-motion';
import { UserCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const TopNav = () => {
    const pathname = usePathname();
    const isAuthority = pathname.startsWith('/authority');

    return (
        <nav className="fixed top-0 right-0 p-8 z-[60] flex items-center gap-4 pointer-events-none">
            <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                {isAuthority ? (
                    <Link
                        href="/dashboard"
                        className="glass-card px-6 py-2.5 flex items-center gap-3 border-primary/30 bg-primary/10 text-primary font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Exit Secure Terminal
                    </Link>
                ) : (
                    <Link
                        href="/auth/login"
                        className="glass-card px-6 py-2.5 flex items-center gap-3 border-white/10 bg-white/5 text-white/60 font-bold uppercase text-[10px] tracking-widest hover:border-primary/50 hover:text-white transition-all group"
                    >
                        <UserCircle className="w-4 h-4 group-hover:text-primary" />
                        Personnel Login
                    </Link>
                )}
            </motion.div>
        </nav>
    );
};
