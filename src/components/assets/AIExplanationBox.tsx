'use client'

import { motion } from 'framer-motion';
import { Bot, Sparkles, Terminal } from 'lucide-react';
import { Asset } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
    asset: Asset;
}

export const AIExplanationBox = ({ asset }: Props) => {
    const getExplanation = () => {
        const latestIssue = asset.analysis[0].detectedIssue;
        const confidence = asset.analysis[0].confidence;

        if (asset.status === 'Healthy') {
            return `CCTV Vision analysis confirms nominal structural integrity. Scans show zero visual hazards or abnormal surface patterns. Structural integrity score is ${asset.healthScore.toFixed(1)}%. AI confidence is high (${confidence}%).`;
        }
        if (asset.status === 'Warning') {
            return `Visual analysis identified potential ${latestIssue.toLowerCase()}. Minor surface irregularities detected in the current CCTV frame. Integrity trend is ${asset.trend}. Recommendation: Confirm visual audit findings with a physical inspection.`;
        }
        return `CRITICAL HAZARD: AI vision confirms ${latestIssue.toLowerCase()} with high severity. Detected via sector ${asset.id}_CAM_01. Immediate structural risk identified. Deploy rapid response repair crew and restrict sector access.`;
    };

    return (
        <motion.div
            className="glass-card p-6 border-primary/20 bg-primary/5 relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-white tracking-tight uppercase text-sm">UrbanGuard AI Visual Analysis</h4>
                <div className="ml-auto flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-white/20" />
                    <span className="text-[10px] font-mono text-white/30 uppercase">Vision Engine v4.1</span>
                </div>
            </div>

            <div className="space-y-4 relative">
                <p className="text-sm text-white/80 leading-relaxed font-medium font-outfit">
                    &quot;{getExplanation()}&quot;
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">AI Confidence</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${asset.analysis[0].confidence}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono text-primary font-bold">{asset.analysis[0].confidence}%</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Impact Level</span>
                        <span className={cn(
                            "text-xs font-black uppercase tracking-widest",
                            asset.analysis[0].severity === 'High' ? 'text-red-500' :
                                asset.analysis[0].severity === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                        )}>
                            {asset.analysis[0].severity} SEVERITY
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
