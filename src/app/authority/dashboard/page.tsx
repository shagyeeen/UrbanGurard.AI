'use client'

import { useAssetStore } from '@/store/useAssetStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, BarChart, MapPin, Clock, ArrowUpRight, CheckCircle2, Siren } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AIAnalyser } from '@/components/dashboard/AIAnalyser';

export default function AuthorityDashboard() {
    const { assets, selectedCity, resolveIssue, addProgressStep } = useAssetStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'emergency' | 'analyser'>('emergency');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const cityAssets = assets.filter(a => a.city === selectedCity);
    const criticalAssets = cityAssets.filter(a => a.status === 'Critical');
    const warningAssets = cityAssets.filter(a => a.status === 'Warning');

    return (
        <div className="space-y-8 py-6">
            {/* Authority Header - CINEMATIC COMMAND CENTER */}
            <header className="flex justify-between items-start bg-red-500/5 border border-red-500/20 p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none group-hover:bg-red-500/[0.04] transition-colors" />
                <div className="absolute top-0 right-0 p-6 pointer-events-none">
                    <Siren className="w-20 h-20 text-red-500/10 animate-pulse group-hover:text-red-500/20 transition-colors" />
                </div>

                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="px-3 py-1 bg-red-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                            RESTRICTED ACCESS
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Secure Line: ACTIVE</span>
                        </div>
                    </div>

                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        EMERGENCY <span className="text-red-500 italic drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">RESPONSE</span> HUB
                    </h1>
                    <p className="text-white/30 text-sm font-bold uppercase tracking-widest pl-1">
                        Infrastructure Hazard Vectoring: <span className="text-white/60">{selectedCity} SECTOR // GRID-ALPHA-4</span>
                    </p>

                    <div className="flex gap-4 mt-10">
                        {[
                            { id: 'emergency', label: 'Emergency Protocols' },
                            { id: 'analyser', label: 'AI Analyser' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                                    activeTab === tab.id
                                        ? "bg-red-500 text-black border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                                        : "bg-white/5 text-white/20 border-white/5 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-right relative z-10">
                    <div className="flex flex-col items-end">
                        <div className="relative">
                            <span className="text-8xl font-mono font-black text-red-500/20 leading-none">{criticalAssets.length}</span>
                            <span className="absolute inset-0 flex items-center justify-center text-5xl font-mono font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                {criticalAssets.length}
                            </span>
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2">Active Critical Faults</span>
                    </div>
                </div>
            </header>

            <AnimatePresence mode='wait'>
                {activeTab === 'emergency' ? (
                    <motion.div
                        key="emergency"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-12 gap-8"
                    >
                        {/* Critical Action Items */}
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    Priority Intervention List
                                </h2>
                                <span className="text-[10px] text-white/20 font-mono">SCANNED BY NEURAL-GRID v4.1</span>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence>
                                    {isMounted && criticalAssets.map((asset, idx) => (
                                        <motion.div
                                            key={asset.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="glass-card p-6 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all flex flex-col md:flex-row gap-6 relative group"
                                        >
                                            <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden border border-white/5 bg-black">
                                                <img src={asset.analysis[0].imageUrl} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all" alt="Asset" />
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white tracking-tight">{asset.name}</h3>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-white/40 uppercase">
                                                                <MapPin className="w-3 h-3" /> {asset.location}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500/60 uppercase">
                                                                <ShieldAlert className="w-3 h-3" /> {asset.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-black text-red-500 uppercase tracking-widest">Immediate Risk</div>
                                                        <div className="text-[10px] text-white/20 font-mono mt-1">CODE: {asset.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                                    <p className="text-sm font-bold text-white/80">Primary Hazard: <span className="text-red-400 uppercase">{asset.analysis[0].detectedIssue}</span></p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {asset.analysis[0].recommendations.map((rec, i) => (
                                                            <span key={i} className="text-[9px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 font-bold uppercase">
                                                                {rec}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between gap-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/assets/${asset.id}`}
                                                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:text-primary hover:border-primary/40 transition-all flex items-center"
                                                    >
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => resolveIssue(asset.id, asset.detections[0].id, 'Emergency Repair Dispatched')}
                                                        className="p-3 bg-red-500 rounded-xl text-black hover:scale-105 transition-all flex items-center"
                                                        title="Mark as Resolved"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Add Progress Step..."
                                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-red-500/50 outline-none"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    addProgressStep(asset.id, asset.detections[0].id, e.currentTarget.value);
                                                                    e.currentTarget.value = '';
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        {asset.detections[0].progress?.slice(-2).map((p, i) => (
                                                            <div key={i} className="text-[8px] text-white/40 flex justify-between">
                                                                <span>• {p.step}</span>
                                                                <span className="font-mono">{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isMounted && criticalAssets.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative flex flex-col items-center justify-center p-24 glass-card border-emerald-500/10 bg-emerald-500/[0.02] border-dashed overflow-hidden min-h-[440px]"
                                    >
                                        {/* RADAR SWEEP ANIMATION */}
                                        <div className="absolute inset-0 flex items-center justify-center -z-0">
                                            <div className="w-[450px] h-[450px] border border-emerald-500/5 rounded-full relative">
                                                <div className="absolute inset-0 border border-emerald-500/5 rounded-full scale-75" />
                                                <div className="absolute inset-0 border border-emerald-500/5 rounded-full scale-50" />
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                                    className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-emerald-500/40 to-transparent -translate-y-1/2 -ml-[50%] origin-center"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative z-10 text-center">
                                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-8 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                            </div>
                                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">All Clear</h3>
                                            <p className="text-emerald-500/40 text-sm font-bold uppercase tracking-[0.2em] mb-8">No high-risk structural anomalies detected</p>

                                            <div className="flex gap-8 justify-center items-center">
                                                <div className="text-left py-4 px-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Neural Verification</div>
                                                    <div className="text-emerald-500 font-mono text-xs uppercase">Fixed [100.0%]</div>
                                                </div>
                                                <div className="text-left py-4 px-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Signal Latency</div>
                                                    <div className="text-primary font-mono text-xs uppercase">8ms // Synced</div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel: Analytics */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="glass-card p-6 border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <BarChart className="w-8 h-8 text-white/5" />
                                </div>
                                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Regional Risk Distribution</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-red-500">Critical Hazards</span>
                                            <span className="text-white">{criticalAssets.length}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500" style={{ width: `${(criticalAssets.length / cityAssets.length) * 100}%` }} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-amber-500">Warnings</span>
                                            <span className="text-white">{warningAssets.length}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500" style={{ width: `${(warningAssets.length / cityAssets.length) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 border-white/10 bg-white/5">
                                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Inspection Protocols</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Bridge Integrity Audit', time: '14:30', status: 'Pending' },
                                        { label: 'Road Surface Scan', time: '15:45', status: 'Active' },
                                        { label: 'Pipeline Thermal Check', time: '09:00', status: 'Completed' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-white/20" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-white uppercase">{item.label}</p>
                                                    <p className="text-[8px] text-white/30 uppercase mt-0.5">{item.time} Today</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                                item.status === 'Active' ? 'bg-primary/20 text-primary' :
                                                    item.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                                            )}>
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 border border-white/5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex flex-col items-center text-center space-y-4">
                                <ShieldAlert className="w-10 h-10 text-primary" />
                                <p className="text-xs text-white/60 font-medium leading-relaxed">
                                    Request rapid-response deployment for detected hazards directly from this console.
                                </p>
                                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:border-primary transition-all">
                                    Export System Logs
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="analyser"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <AIAnalyser />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
