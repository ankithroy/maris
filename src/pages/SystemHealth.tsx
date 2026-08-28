import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, Server, Cpu, HardDrive, Wifi, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export function SystemHealth() {
  const systems = [
    { name: 'AI Inference Engine', status: 'operational', icon: Server, latency: '42ms' },
    { name: 'Sonar Data Ingestion', status: 'operational', icon: HardDrive, latency: '12ms' },
    { name: 'Geospatial DB', status: 'operational', icon: Server, latency: '8ms' },
    { name: 'AUV Telemetry Link', status: 'operational', icon: Radio, latency: '120ms' },
    { name: 'GPS / IMU Stream', status: 'operational', icon: Wifi, latency: '15ms' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-st-success/10 border border-st-success/30 p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-st-success">
          <CheckCircle2 className="w-8 h-8" />
          <div><h2 className="font-bold text-lg">ALL SYSTEMS OPERATIONAL</h2><p className="text-sm opacity-80">Last checked: Just now</p></div>
        </div>
        <Badge variant="success" className="px-3 py-1 font-mono">STATUS: GREEN</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-tx-secondary mb-2"><div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> GPU Utilization</div><span className="font-mono">84%</span></div>
          <div className="h-2 w-full bg-glass-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-cyan-acc" /></div>
          <p className="text-xs text-tx-muted text-right">NVIDIA RTX 4090</p>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-tx-secondary mb-2"><div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU Utilization</div><span className="font-mono">32%</span></div>
          <div className="h-2 w-full bg-glass-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '32%' }} className="h-full bg-st-success" /></div>
          <p className="text-xs text-tx-muted text-right">AMD Ryzen Threadripper</p>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-tx-secondary mb-2"><div className="flex items-center gap-2"><Server className="w-4 h-4" /> Memory</div><span className="font-mono">42GB / 128GB</span></div>
          <div className="h-2 w-full bg-glass-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '33%' }} className="h-full bg-cyan-acc" /></div>
          <p className="text-xs text-tx-muted text-right">DDR5 ECC</p>
        </GlassCard>
      </div>
      <h3 className="font-semibold text-tx-primary mt-8 mb-4">Service Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys) => (
          <GlassCard key={sys.name} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 rounded-lg border border-glass-border"><sys.icon className="w-5 h-5 text-tx-secondary" /></div>
              <div><p className="font-medium text-tx-primary">{sys.name}</p><p className="text-xs font-mono text-tx-muted">Latency: {sys.latency}</p></div>
            </div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-st-success animate-pulse" /><span className="text-sm text-st-success font-medium uppercase tracking-wider">{sys.status}</span></div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
