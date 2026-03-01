'use client'

import { useParams, useRouter } from 'next/navigation';
import { useAssetStore } from '@/store/useAssetStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
    ArrowLeft,
    MapPin,
    Activity,
    ShieldCheck,
    AlertTriangle,
    ShieldAlert,
    Cpu,
    CheckCircle2
} from 'lucide-react';
import { AIExplanationBox } from '@/components/assets/AIExplanationBox';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AssetDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getAssetById } = useAssetStore();
    const asset = getAssetById(id as string);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [view, setView] = useState<'live' | 'historical'>('live');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleGeneratePDF = async () => {
        if (!asset) return;
        setIsGenerating(true);

        try {
            const doc = new jsPDF();

            // Premium Header
            doc.setFillColor(5, 7, 10);
            doc.rect(0, 0, 210, 45, 'F');

            doc.setTextColor(6, 182, 212);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('URBANGUARD AI - COMPLIANCE REPORT', 15, 25);

            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`REPORT_ID: ${asset.id}_${Date.now()}`, 15, 35);

            // Branding Accent
            doc.setFillColor(6, 182, 212);
            doc.rect(0, 44, 210, 1, 'F');

            // Asset Overview
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.text('ASSET IDENTIFICATION', 20, 65);
            doc.setDrawColor(6, 182, 212);
            doc.line(20, 68, 80, 68);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Asset Name:`, 25, 80); doc.setFont('helvetica', 'bold'); doc.text(`${asset.name}`, 60, 80);
            doc.setFont('helvetica', 'normal'); doc.text(`Location:`, 25, 88); doc.text(`${asset.location}, ${asset.city}`, 60, 88);
            doc.text(`Asset Type:`, 25, 96); doc.text(`${asset.type}`, 60, 96);
            doc.text(`Internal ID:`, 25, 104); doc.text(`${asset.id}`, 60, 104);

            // Health Metrics
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('VISUAL INSPECTION SUMMARY', 20, 125);
            doc.line(20, 128, 80, 128);

            const statusColor = asset.status === 'Healthy' ? [16, 185, 129] : asset.status === 'Warning' ? [245, 158, 11] : [239, 68, 68];
            doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.setFontSize(13);
            doc.text(`CURRENT STATUS: ${asset.status.toUpperCase()}`, 25, 140);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Overall Integrity Score: ${asset.healthScore.toFixed(2)}%`, 25, 150);
            doc.text(`Latest Discovery: ${asset.analysis[0].detectedIssue}`, 25, 158);

            // Vision Analysis
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('AI VISION ANALYSIS', 20, 175);
            doc.line(20, 178, 80, 178);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Detection Confidence: ${asset.analysis[0].confidence}%`, 25, 190);
            doc.text(`Severity Level: ${asset.analysis[0].severity}`, 25, 198);
            doc.text(`Analysis Timestamp: ${new Date(asset.analysis[0].timestamp).toLocaleString()}`, 25, 206);

            // Detections Log
            if (asset.detections.length > 0) {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('VISUAL DETECTION LOG', 20, 225);
                doc.line(20, 228, 80, 228);

                let yPos = 240;
                asset.detections.slice(0, 3).forEach((detection, i) => {
                    if (yPos > 275) return;
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`[DETECTION-0${i + 1}]`, 25, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`${detection.description}`, 55, yPos);
                    doc.setFontSize(7);
                    doc.setTextColor(120, 120, 120);
                    doc.text(`${new Date(detection.timestamp).toLocaleString()}`, 55, yPos + 4);
                    doc.setTextColor(0, 0, 0);
                    yPos += 14;
                });
            }

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(180, 180, 180);
            doc.text('URBANGUARD SECURE TELEMETRY - CONFIDENTIAL DOCUMENT', 105, 285, { align: 'center' });
            doc.text(`System Generated on ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });

            await new Promise(r => setTimeout(r, 1500));

            doc.save(`${asset.name.replace(/\s+/g, '_')}_Compliance_Report.pdf`);
            setIsGenerated(true);
            setTimeout(() => setIsGenerated(false), 3000);
        } catch (error) {
            console.error('PDF Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!asset) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Asset Identification Error</h2>
            <p className="text-white/40 mb-8">Node requested for &quot;{id}&quot; is not registered in the UrbanGuard network.</p>
            <button onClick={() => router.back()} className="px-6 py-3 glass-card text-primary font-bold hover:scale-105 transition-transform">
                Return to Navigation
            </button>
        </div>
    );

    const statusIcons = {
        Healthy: { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        Warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        Critical: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    };

    const statusInfo = statusIcons[asset.status];

    return (
        <div className="space-y-8 py-4 pb-20">
            <header className="flex items-center gap-6">
                <Link href="/dashboard" className="p-3 glass-card hover:bg-white/10 transition-colors group">
                    <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-4">
                        {asset.name}
                        <span className={cn(
                            "text-xs px-3 py-1 rounded-full border border-white/10 glass-card bg-white/5 font-mono tracking-tighter text-white/40",
                            asset.status === 'Critical' && "animate-pulse-critical border-red-500/30 text-red-400"
                        )}>
                            {asset.id}
                        </span>
                    </h2>
                    <p className="text-white/40 flex items-center gap-2 mt-1 font-medium italic">
                        <MapPin className="w-4 h-4" /> {asset.location}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className={cn("flex items-center gap-3 px-6 py-4 rounded-2xl border glass-card", statusInfo.bg, statusInfo.border)}>
                        <statusInfo.icon className={cn("w-6 h-6", statusInfo.color)} />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5 leading-none">Status</span>
                            <span className={cn("text-lg font-black uppercase tracking-tight leading-none", statusInfo.color)}>{asset.status}</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Health</span>
                        <span className="text-2xl font-black text-white">{asset.healthScore.toFixed(0)}%</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <motion.div
                        className="glass-card p-8 min-h-[400px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    CCTV Vision Analysis Feed
                                </h3>
                                <p className="text-sm text-white/30 italic mt-1 uppercase tracking-tighter">Scanning Frequency: 30fps · Feed: {asset.id}_CAM_01</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 glass-card text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border-primary/20">
                                    Live Stream
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 group bg-black">
                            {asset.analysis[0].videoUrl ? (
                                <video
                                    src={asset.analysis[0].videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                            ) : (
                                <img
                                    src={asset.analysis[0].imageUrl}
                                    alt="CCTV Feed"
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                            )}

                            {/* CCTV Overlay Aesthetic */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {/* Scanlines */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />

                                {/* Telemetry Data */}
                                <div className="absolute top-6 right-6 text-right font-mono">
                                    <div className="text-[10px] text-primary/80 font-black tracking-widest uppercase">Cam-01 // Uplink_Stable</div>
                                    <div className="text-[10px] text-white/40">{new Date().toLocaleDateString()}</div>
                                    <div className="text-[10px] text-white/40">{isMounted ? new Date().toLocaleTimeString() : '--:--:--'}</div>
                                </div>

                                {/* REC Indicator */}
                                <div className="absolute top-6 left-6 flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_red]" />
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">Live Tracking</span>
                                </div>

                                {/* Corners */}
                                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20" />
                                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20" />
                                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                            {/* AI Scanning Overlays */}
                            <div className="absolute top-16 left-6 flex flex-col gap-2">
                                <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded text-[10px] font-black text-primary border border-primary/40 flex items-center gap-2 uppercase w-fit">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                    Vision Module Active
                                </span>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="p-4 glass-card bg-black/40 backdrop-blur-xl border-primary/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Damage Correlation Matrix</span>
                                        <span className="text-[10px] font-bold text-primary">{asset.analysis[0].confidence}% Confidence Index</span>
                                    </div>
                                    <p className="text-lg font-bold text-white uppercase tracking-tight">
                                        {asset.analysis[0].detectedIssue}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5">
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-4">Preventive Actions Required</h4>
                                <div className="space-y-2">
                                    {asset.analysis[0].recommendations.map((rec, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                                            <div className="mt-1 p-1 bg-primary/20 rounded-lg">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <p className="text-xs font-bold text-white/80">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 glass-card bg-white/5">
                                        <span className="text-[9px] uppercase font-black text-white/30 block mb-1">Impact Level</span>
                                        <span className={cn(
                                            "text-lg font-black uppercase tracking-tight",
                                            asset.analysis[0].severity === 'High' ? 'text-red-400' : 'text-amber-400'
                                        )}>{asset.analysis[0].severity}</span>
                                    </div>
                                    <div className="p-4 glass-card bg-white/5">
                                        <span className="text-[9px] uppercase font-black text-white/30 block mb-1">Visual Trend</span>
                                        <span className={cn(
                                            "text-lg font-black uppercase tracking-tight",
                                            asset.trend === 'improving' ? 'text-emerald-400' : asset.trend === 'declining' ? 'text-red-400' : 'text-white/60'
                                        )}>{asset.trend}</span>
                                    </div>
                                </div>
                                <div className="p-4 glass-card bg-primary/5 border-primary/10">
                                    <span className="text-[9px] uppercase font-black text-primary/60 block mb-1 tracking-widest">Next Scheduled Inspection</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-widest">Within 48 Hours — TIER 1 RESPONSE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <AIExplanationBox asset={asset} />
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            Hardware Registry
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Infrastructure Type</span>
                                <span className="text-sm font-bold text-white">{asset.type}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Last Visual Audit</span>
                                <span className="text-sm font-bold text-white">{asset.lastInspection}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Data Integrity</span>
                                <span className="text-sm font-bold text-emerald-400">NOMINAL</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-white/40">Communication</span>
                                <span className="text-sm font-bold text-primary">ENCRYPTED</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            Local Incident Log
                        </h3>
                        <div className="space-y-4 flex-1">
                            {asset.detections.map((detection, idx) => (
                                <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">{detection.issue}</p>
                                    <p className="text-xs font-bold text-white/80">{detection.description}</p>
                                    <p className="text-[10px] font-mono text-white/20">{isMounted ? new Date(detection.timestamp).toLocaleString() : '---'}</p>
                                </div>
                            ))}
                            {asset.detections.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20">
                                    <CheckCircle2 className="w-12 h-12 mb-3" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest italic">Zero Hazards Detected</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleGeneratePDF}
                            disabled={isGenerating}
                            className={cn(
                                "mt-6 w-full py-4 text-[10px] uppercase tracking-widest font-black rounded-xl transition-all border",
                                isGenerating
                                    ? "bg-primary/20 text-primary border-primary/40 animate-pulse"
                                    : isGenerated
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                        : "text-white/20 border-white/10 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isGenerating ? 'Packaging Secure PDF...' : isGenerated ? 'Report Downloaded' : 'Generate Compliance PDF'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
