import { useMarisStore } from '../lib/store';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, Server, Cpu, HardDrive, Wifi, Radio, RefreshCw, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function SystemHealth() {
  const isDiagnosticRunning = useMarisStore((state) => state.isDiagnosticRunning);
  const diagnosticProgress = useMarisStore((state) => state.diagnosticProgress);
  const runDiagnostics = useMarisStore((state) => state.runDiagnostics);

  const subsystems = [
    { name: 'Multibeam Transducer (EdgeTech 4200)', status: 'OPERATIONAL', latency: '2.4ms', icon: Radio },
    { name: 'NVIDIA Jetson AGX Orin Inference Node', status: 'OPERATIONAL', latency: '42.1ms', icon: Cpu },
    { name: 'AUV Acoustic Telemetry Modem', status: 'OPERATIONAL', latency: '12.8ms', icon: Wifi },
    { name: 'PostgreSQL PostGIS Geospatial Storage', status: 'OPERATIONAL', latency: '1.1ms', icon: HardDrive },
    { name: 'Vessel Gateway Edge Service', status: 'OPERATIONAL', latency: '0.8ms', icon: Server },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-tx-primary tracking-tight">System Health & Diagnostics</h2>
          <p className="text-tx-secondary text-sm">AUV hardware status, telemetry bandwidth, and edge compute nodes.</p>
        </div>
        <button 
          onClick={() => runDiagnostics()}
          disabled={isDiagnosticRunning}
          className="px-5 py-2.5 rounded-xl bg-cyan-acc text-deep-ocean font-bold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
          {isDiagnosticRunning ? `Running Diagnostics (${diagnosticProgress}%)` : 'Run Diagnostics'}
        </button>
      </div>

      {/* Progress Bar during diagnostic run */}
      {isDiagnosticRunning && (
        <GlassCard className="p-4 space-y-2 border-cyan-acc/40">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-acc font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" /> Testing Subsystem Connectivity & Memory Latency...
            </span>
            <span className="text-tx-primary font-bold">{diagnosticProgress}%</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-glass-border">
            <motion.div 
              className="h-full bg-cyan-acc"
              animate={{ width: `${diagnosticProgress}%` }}
              transition={{ ease: 'easeInOut' }}
            />
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-st-success/10 border border-st-success/30 text-st-success">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-tx-muted uppercase tracking-wider font-semibold">Overall System Status</p>
            <p className="text-xl font-bold text-st-success">100% Operational</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-acc/10 border border-cyan-acc/30 text-cyan-acc">
            <Wifi className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-tx-muted uppercase tracking-wider font-semibold">Acoustic Signal Margin</p>
            <p className="text-xl font-bold text-tx-primary">+18.4 dB</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-acc/10 border border-cyan-acc/30 text-cyan-acc">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-tx-muted uppercase tracking-wider font-semibold">GPU Memory Utilization</p>
            <p className="text-xl font-bold text-tx-primary">4.2 / 16 GB (26%)</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6 space-y-4">
        <h3 className="font-bold text-lg text-tx-primary border-b border-glass-border pb-3">Subsystem Status Feed</h3>
        <div className="space-y-3">
          {subsystems.map((sub, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-black/30 border border-glass-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-glass-bg text-cyan-acc border border-glass-border">
                  <sub.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-tx-primary">{sub.name}</h4>
                  <span className="text-xs font-mono text-tx-muted">Ping Latency: {sub.latency}</span>
                </div>
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {sub.status}
              </Badge>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
