'use client'

import { useState, useMemo } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Activity, History, CheckCircle2, XCircle, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { Asset } from '@/types';

export const AIAnalyser = () => {
    const { assets, selectedCity } = useAssetStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    const filteredAssets = useMemo(() => {
        if (!searchQuery) return [];
        return assets.filter(a =>
            a.city === selectedCity &&
            (a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [assets, searchQuery, selectedCity]);

    const selectedAsset = useMemo(() =>
        assets.find(a => a.id === selectedAssetId),
        [assets, selectedAssetId]);

    // Transparency Data (Predefined/Aggregated)
    const transparencyData = useMemo(() => {
        const cityAssets = assets.filter(a => a.city === selectedCity);
        const allDetections = cityAssets.flatMap(a => a.detections);
        const resolved = allDetections.filter(d => d.isResolved).length;
        const pending = allDetections.filter(d => !d.isResolved).length;

        return [
            { name: 'Processed', value: resolved, color: '#06B6D4' },
            { name: 'Pending', value: pending, color: '#EF4444' }
        ];
    }, [assets, selectedCity]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-12 gap-8">
                {/* Search and Results Section */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 bg-primary/5 border-primary/20 relative overflow-hidden group">
                        {/* Decorative Grid */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6,182,212,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                        {/* Scanning Line */}
                        <motion.div
                            animate={{ top: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0 opacity-50"
                        />

                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Smart Sector Search
                        </h3>
                        <div className="relative z-10">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search location (e.g. Kilambakkam)..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10 uppercase"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode='popLayout'>
                            {filteredAssets.map((asset) => (
                                <motion.div
                                    key={asset.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "glass-card p-4 transition-all cursor-pointer border-white/5 group",
                                        selectedAssetId === asset.id ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "bg-white/5 hover:bg-white/10"
                                    )}
                                    onClick={() => setSelectedAssetId(asset.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{asset.name}</h4>
                                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                                                <MapPin className="w-3 h-3" /> {asset.location}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                            asset.status === 'Healthy' ? "bg-emerald-500/10 text-emerald-500" :
                                                asset.status === 'Warning' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {asset.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {searchQuery && filteredAssets.length === 0 && (
                            <div className="text-center py-10 glass-card border-white/5 opacity-40 italic text-xs text-white">
                                no assets found in this sector
                            </div>
                        )}
                        {!searchQuery && (
                            <div className="text-center py-20 opacity-20 group relative overflow-hidden glass-card border-dashed border-white/5 border-2">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.1, 0.3, 0.1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="relative"
                                >
                                    <Activity className="w-16 h-16 mx-auto mb-6 text-primary" />
                                </motion.div>
                                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Neural Uplink Offline</p>
                                <p className="text-[9px] text-white/50 uppercase mt-2 tracking-widest font-mono italic">awaiting sector coordinates...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis/Details Section */}
                <div className="col-span-12 lg:col-span-8">
                    <AnimatePresence mode='wait'>
                        {selectedAsset ? (
                            <motion.div
                                key={selectedAsset.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Asset Overview Header - CINEMATIC HUD */}
                                <div className="glass-card p-8 border-white/10 bg-black/40 relative overflow-hidden group min-h-[340px]">
                                    {/* Scanning Data Grid Background */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

                                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-3 justify-center md:justify-start"
                                            >
                                                <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                                                    Neural Uplink Active
                                                </div>
                                                <span className="text-[10px] text-white/40 font-mono animate-pulse">STRAT-SEC // {selectedCity.toUpperCase()}</span>
                                            </motion.div>

                                            <motion.h2
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-5xl font-black text-white uppercase tracking-tighter leading-none"
                                            >
                                                {selectedAsset.name}
                                            </motion.h2>

                                            <div className="flex items-center gap-6 justify-center md:justify-start pt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Scanning Freq</span>
                                                    <span className="text-xs font-mono text-white/80">44.1 kHz / 32-bit</span>
                                                </div>
                                                <div className="w-px h-8 bg-white/10" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Data Stability</span>
                                                    <span className="text-xs font-mono text-emerald-500">OPTIMAL</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CIRCULAR INTEGRITY GAUGE */}
                                        <div className="relative w-48 h-48 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle
                                                    cx="96" cy="96" r="88"
                                                    className="stroke-white/5 fill-none"
                                                    strokeWidth="4"
                                                />
                                                <motion.circle
                                                    cx="96" cy="96" r="88"
                                                    className="stroke-primary fill-none drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    initial={{ strokeDasharray: "0 553" }}
                                                    animate={{ strokeDasharray: `${(selectedAsset.healthScore / 100) * 553} 553` }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <motion.span
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="text-5xl font-black text-white font-mono"
                                                >
                                                    {selectedAsset.healthScore.toFixed(0)}<span className="text-xs text-primary">%</span>
                                                </motion.span>
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mt-1 pr-1">Integrity</span>
                                            </div>

                                            {/* Rotating decoration */}
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                                className="absolute inset-0 border-[1px] border-dashed border-white/10 rounded-full scale-[1.15]"
                                            />
                                        </div>
                                    </div>

                                    {/* 7-DAY MINI GRAPH OVERLAY */}
                                    <div className="h-24 w-full mt-10 relative">
                                        <div className="absolute top-0 left-0 text-[8px] font-black text-white/20 uppercase tracking-widest pl-2">Temporal Variance Index</div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={selectedAsset.history}>
                                                <defs>
                                                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area type="monotone" dataKey="score" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorHealth)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Comparison & Action Transparency */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Authority Processing Rate</h3>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                                                <span className="text-[8px] font-mono text-primary/60 italic leading-none">REAL-TIME</span>
                                            </div>
                                        </div>

                                        <div className="h-48 w-full relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={transparencyData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={55}
                                                        outerRadius={75}
                                                        paddingAngle={8}
                                                        dataKey="value"
                                                    >
                                                        {transparencyData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={entry.color}
                                                                stroke="rgba(0,0,0,0.5)"
                                                                strokeWidth={2}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-xl font-black text-white leading-none">
                                                    {((transparencyData[0].value / (transparencyData[0].value + transparencyData[1].value || 1)) * 100).toFixed(0)}%
                                                </span>
                                                <span className="text-[7px] font-black text-white/20 uppercase mt-1">Resolution</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-6 mt-4">
                                            {transparencyData.map(d => (
                                                <div key={d.name} className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                                                        <span className="text-[10px] font-black text-white uppercase">{d.value}</span>
                                                    </div>
                                                    <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{d.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 border-white/5 space-y-4">
                                        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                            Action Transparency Log
                                        </h3>
                                        <div className="space-y-4 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin">
                                            {selectedAsset.detections.length > 0 ? (
                                                selectedAsset.detections.map((det) => (
                                                    <div key={det.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <span className="text-xs font-bold text-white leading-tight block">{det.issue}</span>
                                                                <span className="text-[10px] text-white/40 uppercase font-mono block">Status: {det.isResolved ? 'Resolved' : 'In Progress'}</span>
                                                            </div>
                                                            {det.isResolved ? (
                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                    <span className="text-[8px] font-black text-emerald-500 uppercase">Fixed</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
                                                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                                                    <span className="text-[8px] font-black text-amber-500 uppercase">Active</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* PROGRESS STEPS */}
                                                        <div className="space-y-3 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                                                            {det.progress && det.progress.length > 0 ? (
                                                                det.progress.map((p, idx) => (
                                                                    <div key={idx} className="relative pl-6">
                                                                        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-white/10 border border-black group-hover:bg-primary transition-colors" />
                                                                        <p className="text-[10px] font-bold text-white/80">{p.step}</p>
                                                                        <p className="text-[8px] text-white/20 uppercase mt-0.5">{new Date(p.timestamp).toLocaleString()}</p>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="pl-6">
                                                                    <p className="text-[10px] italic text-white/20">Awaiting dispatch protocols...</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {det.isResolved && det.actionTaken && (
                                                            <div className="pt-2 border-t border-white/5">
                                                                <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">Final Action</p>
                                                                <p className="text-[10px] text-white-70 mt-1 font-medium italic">"{det.actionTaken}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 text-white/10">
                                                    <Info className="w-8 h-8 mb-2" />
                                                    <span className="text-[10px] uppercase font-black tracking-widest">No Operational Faults Recorded</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/20 glass-card border-white/5 p-20 border-dashed">
                                <Activity className="w-16 h-16 mb-4 animate-pulse" />
                                <h3 className="text-xl font-bold uppercase tracking-widest">Select an Asset for Deep-Audit</h3>
                                <p className="text-sm mt-2 opacity-50">Neural synthesis requires a target sector uplink.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
