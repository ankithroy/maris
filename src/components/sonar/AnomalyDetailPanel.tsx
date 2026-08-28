import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { ConfidenceGauge } from './ConfidenceGauge';
import { MapPin, Maximize, Ruler, AlertTriangle, Crosshair, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnomalyDetailPanelProps {
  detection: any;
  onClose: () => void;
}

export function AnomalyDetailPanel({ detection, onClose }: AnomalyDetailPanelProps) {
  if (!detection) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-96 h-full flex flex-col border-l border-glass-border bg-sfc/50 backdrop-blur-xl absolute right-0 top-0 z-20 overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 flex flex-col h-full gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-tx-muted font-mono mb-1">{detection.id}</p>
              <h2 className="text-2xl font-bold text-tx-primary tracking-tight uppercase">{detection.type}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-glass-bg text-tx-secondary hover:text-tx-primary transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center py-4 border-y border-glass-border border-dashed">
            <ConfidenceGauge percentage={detection.confidence} label="AI Confidence" color={detection.color} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-tx-secondary uppercase tracking-wider">Properties</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-glass-bg p-3 rounded-xl border border-glass-border">
                <div className="flex items-center gap-2 text-tx-muted mb-1"><AlertTriangle className="w-4 h-4" /><span className="text-xs">Risk</span></div>
                <Badge variant={detection.risk === 'HIGH' || detection.risk === 'CRITICAL' ? 'danger' : detection.risk === 'MEDIUM' ? 'warning' : 'success'}>{detection.risk}</Badge>
              </div>
              <div className="bg-glass-bg p-3 rounded-xl border border-glass-border">
                <div className="flex items-center gap-2 text-tx-muted mb-1"><Maximize className="w-4 h-4" /><span className="text-xs">Depth</span></div>
                <p className="text-sm font-medium text-tx-primary font-mono">{detection.depth} m</p>
              </div>
              <div className="col-span-2 bg-glass-bg p-3 rounded-xl border border-glass-border">
                <div className="flex items-center gap-2 text-tx-muted mb-1"><MapPin className="w-4 h-4" /><span className="text-xs">Coordinates</span></div>
                <p className="text-sm font-medium text-tx-primary font-mono">{detection.lat}° N, {detection.lng}° E</p>
              </div>
              <div className="col-span-2 bg-glass-bg p-3 rounded-xl border border-glass-border">
                <div className="flex items-center gap-2 text-tx-muted mb-1"><Ruler className="w-4 h-4" /><span className="text-xs">Estimated Size</span></div>
                <p className="text-sm font-medium text-tx-primary font-mono">{detection.size}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-semibold text-tx-secondary uppercase tracking-wider">AI Analysis</h3>
            <GlassCard className="p-4 space-y-3 bg-black/20">
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-tx-secondary">Acoustic Shadow</span><span className="text-tx-primary font-mono">95%</span></div>
                <div className="h-1.5 w-full bg-glass-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ delay: 0.2, duration: 1 }} className="h-full bg-cyan-acc rounded-full" /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-tx-secondary">Shape Consistency</span><span className="text-tx-primary font-mono">91%</span></div>
                <div className="h-1.5 w-full bg-glass-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '91%' }} transition={{ delay: 0.3, duration: 1 }} className="h-full bg-cyan-acc rounded-full" /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-tx-secondary">Texture Anomaly</span><span className="text-tx-primary font-mono">87%</span></div>
                <div className="h-1.5 w-full bg-glass-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ delay: 0.4, duration: 1 }} className="h-full bg-cyan-acc rounded-full" /></div>
              </div>
            </GlassCard>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-glass-bg border border-glass-border text-tx-primary text-sm font-medium hover:bg-white/10 transition-colors">Ignore</button>
              <button className="flex-1 py-2.5 rounded-xl bg-cyan-acc/20 border border-cyan-acc/50 text-cyan-acc text-sm font-medium hover:bg-cyan-acc/30 transition-colors flex items-center justify-center gap-2"><Crosshair className="w-4 h-4" /> Mark Hazard</button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
