import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnomalyDetailPanel } from '../components/sonar/AnomalyDetailPanel';
import { Settings2, Maximize, ZoomIn, ZoomOut, Target, Grid3X3, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const mockDetections = [
  { id: 'ANM-000184', type: 'Ghost Net', confidence: 94.2, risk: 'HIGH', lat: 26.1158, lng: 91.7086, depth: 42.7, size: '4.2 × 12.7 m', color: '#EF4444', box: { x: 30, y: 40, w: 15, h: 20 } },
  { id: 'ANM-000185', type: 'Shipwreck', confidence: 97.8, risk: 'CRITICAL', lat: 26.1160, lng: 91.7080, depth: 45.1, size: '18.5 × 8.2 m', color: '#F97316', box: { x: 60, y: 20, w: 25, h: 30 } },
  { id: 'ANM-000186', type: 'Pipe', confidence: 88.5, risk: 'MEDIUM', lat: 26.1155, lng: 91.7091, depth: 40.2, size: '1.5 × 25.0 m', color: '#F59E0B', box: { x: 10, y: 70, w: 40, h: 5 } },
];

export function SonarAnalysis() {
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [showOverlays, setShowOverlays] = useState(true);

  return (
    <div className="h-[calc(100vh-8rem)] relative flex overflow-hidden rounded-[20px] border border-glass-border bg-[#02080c] shadow-glass">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <GlassCard className="p-2 flex flex-col gap-2 bg-black/40 backdrop-blur-md">
          <button className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"><ZoomIn className="w-5 h-5" /></button>
          <button className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"><ZoomOut className="w-5 h-5" /></button>
          <button className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"><Maximize className="w-5 h-5" /></button>
        </GlassCard>
        <GlassCard className="p-2 flex flex-col gap-2 bg-black/40 backdrop-blur-md">
          <button onClick={() => setShowOverlays(!showOverlays)} className={cn("p-2 rounded-lg transition-colors", showOverlays ? "text-cyan-acc bg-cyan-acc/10" : "text-tx-secondary hover:text-tx-primary hover:bg-white/10")}><Layers className="w-5 h-5" /></button>
          <button className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"><Target className="w-5 h-5" /></button>
          <button className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"><Grid3X3 className="w-5 h-5" /></button>
          <button className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"><Settings2 className="w-5 h-5" /></button>
        </GlassCard>
      </div>

      <div className="flex-1 relative cursor-crosshair overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.edgetech.com/wp-content/uploads/2018/06/Shipwreck-4200.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02080c]/50 via-transparent to-[#02080c]/80" />
        {showOverlays && mockDetections.map((detection) => (
          <motion.div key={detection.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className={cn("absolute border-2 transition-all cursor-pointer group flex items-start justify-start", selectedDetection?.id === detection.id ? "z-20 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-white/10" : "z-10 hover:bg-white/5")}
            style={{ left: `${detection.box.x}%`, top: `${detection.box.y}%`, width: `${detection.box.w}%`, height: `${detection.box.h}%`, borderColor: selectedDetection?.id === detection.id ? '#FFF' : detection.color }}
            onClick={() => setSelectedDetection(detection)}>
            <div className="absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-mono font-bold uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md border border-b-0 border-inherit"
              style={{ backgroundColor: `${detection.color}40`, color: selectedDetection?.id === detection.id ? '#FFF' : detection.color, borderColor: selectedDetection?.id === detection.id ? '#FFF' : detection.color }}>
              {detection.type} • {detection.confidence}%
            </div>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-inherit" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-inherit" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-inherit" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-inherit" />
          </motion.div>
        ))}
      </div>

      <AnomalyDetailPanel detection={selectedDetection} onClose={() => setSelectedDetection(null)} />
    </div>
  );
}
