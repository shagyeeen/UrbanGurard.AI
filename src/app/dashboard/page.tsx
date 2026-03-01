'use client'

import { useAssetStore } from '@/store/useAssetStore';
import { RadialHealthGauge } from '@/components/charts/RadialHealthGauge';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, TrendingUp, Camera, Upload, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { SystemInfoModal } from '@/components/dashboard/SystemInfoModal';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { assets, overallHealth, selectedCity } = useAssetStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // AI Vision Uplink State
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const cityAssets = assets.filter(a => a.city === selectedCity);

    const counts = {
        healthy: cityAssets.filter(a => a.status === 'Healthy').length,
        warning: cityAssets.filter(a => a.status === 'Warning').length,
        critical: cityAssets.filter(a => a.status === 'Critical').length,
    };

    const statusCards = [
        { label: 'Healthy', count: counts.healthy, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Warnings', count: counts.warning, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Critical', count: counts.critical, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', pulse: counts.critical > 0 },
    ];

    const recentDetections = cityAssets
        .flatMap(a => a.detections.map(det => ({ ...det, assetName: a.name, assetId: a.id })))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

    // Filter overall health for the specific city
    const cityOverallHealth = cityAssets.length > 0
        ? Math.round(cityAssets.reduce((acc, a) => acc + a.healthScore, 0) / cityAssets.length)
        : 100;

    const topFeeds = cityAssets.filter(a => a.status !== 'Healthy').slice(0, 4);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setUploadedImage(base64String);

            try {
                console.log('Uplink: Initiating neural transfer...', { size: `${(base64String.length / 1024 / 1024).toFixed(2)}MB` });

                const response = await fetch('/api/vision', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64String }),
                });

                if (!response.ok) {
                    const errorBody = await response.json();
                    throw new Error(errorBody.detectedIssue || 'Uplink synchronization failed');
                }

                const data = await response.json();
                setAnalysisResult(data);
                console.log('Uplink: Analysis synchronized successfully.');
            } catch (error: any) {
                console.error('Vision analysis failed:', error);
                setAnalysisResult({
                    detectedIssue: 'Tactical Uplink Error',
                    severity: 'High',
                    assetType: 'Unknown',
                    confidence: 0,
                    recommendations: [
                        'Ensure local server is running (npm run dev)',
                        'Check internet connection for Groq synchronization',
                        'Try a smaller image frame'
                    ]
                });
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-8 py-4">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Urban Health Overview</h2>
                    <p className="text-white/40 font-medium">Monitoring 24/7 Global Infrastructure Network</p>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Last Update</p>
                    <p className="text-sm font-mono text-primary">JUST NOW · LIVE</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Main Health Gauge */}
                <motion.div
                    className="col-span-12 lg:col-span-5 glass-card p-10 flex flex-col items-center justify-center relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="absolute top-0 right-0 p-6">
                        <Info
                            className="w-5 h-5 text-white/20 cursor-pointer hover:text-white lg:hover:scale-110 transition-all"
                            onClick={() => setIsInfoModalOpen(true)}
                        />
                    </div>
                    <RadialHealthGauge score={cityOverallHealth} />
                    <div className="mt-8 text-center">
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Infrastructure Integrity</h3>
                        <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                            Based on real-time visual AI analysis of {cityAssets.length} CCTV data streams.
                        </p>
                    </div>
                </motion.div>

                {/* Status Breakdown Grid */}
                <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6">
                    {statusCards.map((card, idx) => (
                        <motion.div
                            key={card.label}
                            className={cn(
                                "glass-card p-6 flex flex-col justify-between items-center text-center",
                                card.pulse && "animate-pulse-critical border-red-500/30"
                            )}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className={cn("p-3 rounded-2xl mb-3", card.bg)}>
                                <card.icon className={cn("w-6 h-6", card.color)} />
                            </div>
                            <div>
                                <span className="block text-3xl font-bold mb-1 text-white">{card.count}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{card.label}</span>
                            </div>
                        </motion.div>
                    ))}

                    <div className="col-span-3 glass-card p-6 bg-primary/5 border-primary/20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Camera className="w-4 h-4 text-primary" />
                                Active Priority Vision Feeds
                            </h3>
                            <span className="text-[9px] font-bold text-primary animate-pulse">LIVE UPLINK</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {isMounted && topFeeds.map((asset, i) => (
                                <Link key={asset.id} href={`/assets/${asset.id}`} className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all bg-black">
                                    {asset.analysis[0].videoUrl ? (
                                        <video
                                            src={asset.analysis[0].videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                        />
                                    ) : (
                                        <img src={asset.analysis[0].imageUrl} alt="Feed" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 backdrop-blur-md">
                                        <p className="text-[8px] font-bold text-white truncate uppercase tracking-tighter">{asset.name}</p>
                                    </div>
                                    <div className={cn(
                                        "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
                                        asset.status === 'Critical' ? 'bg-red-500 shadow-[0_0_5px_red] animate-pulse' : 'bg-amber-500 shadow-[0_0_5px_orange]'
                                    )} />
                                </Link>
                            ))}
                            {(isMounted && topFeeds.length === 0) && (
                                <div className="col-span-4 py-8 flex items-center justify-center text-white/20 italic text-xs border border-dashed border-white/10 rounded-xl">
                                    No critical vision hazards detected
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Visual Uplink Analyzer */}
                <div className="col-span-12 glass-card p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />

                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                                <Zap className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Advanced Vision Module</span>
                            </div>
                            <h3 className="text-3xl font-black text-white tracking-tighter leading-none">
                                AI Damage <span className="text-primary text-neon">Analyst</span> Uplink
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed max-w-md font-medium">
                                Manually upload infrastructure images or select local CCTV frames for deep structural audit. Our Neural Vision Engine identifies potholes, cracks, and corrosion with direct Groq API synchronization.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUploadClick}
                                    disabled={isAnalyzing}
                                    className="px-6 py-3 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {isAnalyzing ? 'Analyzing Base64...' : 'Upload Inspection Frame'}
                                </button>
                                <button
                                    onClick={() => { setUploadedImage(null); setAnalysisResult(null); }}
                                    className="px-6 py-3 glass-card text-white/60 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:text-white transition-all"
                                >
                                    Reset Uplink
                                </button>
                            </div>

                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Groq Vision Report</span>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                                            analysisResult.severity === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                                        )}>
                                            {analysisResult.severity} Severity
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-white uppercase tracking-tight">{analysisResult.detectedIssue}</p>
                                    <div className="flex gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                        <span>Type: {analysisResult.assetType}</span>
                                        <span>Confidence: {analysisResult.confidence}%</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/20 uppercase">Recommendations:</p>
                                        {analysisResult.recommendations?.map((rec: string, i: number) => (
                                            <div key={i} className="text-[10px] text-white/60 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary" /> {rec}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="glass-card border-white/5 bg-black/40 overflow-hidden relative aspect-video flex flex-col items-center justify-center border-dashed group-hover:border-primary/40 transition-all">
                            {uploadedImage ? (
                                <>
                                    <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Running Neural Inference...</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 m-4 animate-pulse" />
                                </>
                            ) : (
                                <>
                                    <Camera className="w-12 h-12 text-white/5 mb-4 group-hover:text-primary/20 transition-all" />
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Awaiting Visual Input</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Events Feed */}
                <div className="col-span-12 glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Live Operations Feed</h3>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                            REAL-TIME
                        </span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode='popLayout'>
                            {isMounted && recentDetections.map((detection) => (
                                <motion.div
                                    key={detection.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                                >
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        detection.severity === 'Critical' ? 'bg-red-500 neon-glow-critical' : 'bg-amber-500'
                                    )} />
                                    <div className="flex-1">
                                        <p className="text-white font-medium text-sm flex items-center gap-2">
                                            {detection.assetName} <span className="text-white/20">·</span> {detection.description}
                                        </p>
                                        <p className="text-xs text-white/30 mt-1 uppercase tracking-tighter">
                                            Status: {detection.severity} · {isMounted ? new Date(detection.timestamp).toLocaleTimeString() : '---'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/assets/${detection.assetId}`}
                                        className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Analyze Feed
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {recentDetections.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-white/20 italic font-mono text-sm leading-8">Zero visual hazards identified in this scan cycle.</p>
                                <div className="w-12 h-[1px] bg-white/5 mx-auto" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SystemInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />
        </div>
    );
}
