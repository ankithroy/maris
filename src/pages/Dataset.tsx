import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Database, Network, Cpu } from 'lucide-react';

export function Dataset() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-tx-primary">Dataset & Model Performance</h2>
          <p className="text-tx-secondary text-sm">MARIS-YOLO v1.4 • Active Model</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-cyan-acc/10 border border-cyan-acc/30 text-cyan-acc hover:bg-cyan-acc/20 transition-colors text-sm font-medium">Upload New Dataset</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2 text-tx-primary font-semibold border-b border-glass-border pb-3"><Database className="w-5 h-5 text-cyan-acc" />Training Dataset (MARIS-Underwater-DB)</div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-tx-muted mb-1">Total Images</p><p className="font-mono text-xl text-tx-primary">124,580</p></div>
            <div><p className="text-xs text-tx-muted mb-1">Annotated</p><p className="font-mono text-xl text-tx-primary">124,580</p></div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-tx-muted">Dataset Split</p>
            <div className="flex h-3 rounded-full overflow-hidden"><div className="bg-cyan-acc w-[70%]" /><div className="bg-st-warning w-[20%]" /><div className="bg-st-success w-[10%]" /></div>
            <div className="flex justify-between text-xs text-tx-secondary font-mono mt-1"><span>Train: 70%</span><span>Val: 20%</span><span>Test: 10%</span></div>
          </div>
        </GlassCard>
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2 text-tx-primary font-semibold border-b border-glass-border pb-3"><Network className="w-5 h-5 text-cyan-acc" />Model Metrics (MARIS-YOLO v1.4)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-black/20 p-3 rounded-lg border border-glass-border text-center"><p className="text-xs text-tx-secondary mb-1">mAP@50</p><p className="font-mono font-bold text-st-success">94.7%</p></div>
            <div className="bg-black/20 p-3 rounded-lg border border-glass-border text-center"><p className="text-xs text-tx-secondary mb-1">Precision</p><p className="font-mono font-bold text-st-success">95.1%</p></div>
            <div className="bg-black/20 p-3 rounded-lg border border-glass-border text-center"><p className="text-xs text-tx-secondary mb-1">Recall</p><p className="font-mono font-bold text-st-warning">92.8%</p></div>
            <div className="bg-black/20 p-3 rounded-lg border border-glass-border text-center"><p className="text-xs text-tx-secondary mb-1">F1 Score</p><p className="font-mono font-bold text-st-success">93.9%</p></div>
          </div>
          <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-glass-border"><div className="flex items-center gap-2 text-sm text-tx-secondary"><Cpu className="w-4 h-4" /> Inference Latency</div><span className="font-mono font-bold text-cyan-acc">42ms</span></div>
        </GlassCard>
      </div>
    </div>
  );
}
