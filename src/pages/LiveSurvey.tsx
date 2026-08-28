import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Compass, Thermometer, Battery, Signal, ArrowUpRight, Gauge, Activity, Radio } from 'lucide-react';

export function LiveSurvey() {
  const [telemetry, setTelemetry] = useState({
    depth: 42.5,
    heading: 145,
    speed: 3.2,
    pitch: 2.1,
    roll: -1.5,
    heave: 0.2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        depth: prev.depth + (Math.random() - 0.5) * 0.2,
        heading: (prev.heading + (Math.random() - 0.5) * 2) % 360,
        speed: prev.speed + (Math.random() - 0.5) * 0.1,
        pitch: prev.pitch + (Math.random() - 0.5) * 0.5,
        roll: prev.roll + (Math.random() - 0.5) * 0.5,
        heave: prev.heave + (Math.random() - 0.5) * 0.1
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const liveDetections = [
    { time: '14:32:18', type: 'Ghost Net', conf: 94, color: 'text-st-danger' },
    { time: '14:31:42', type: 'Unknown', conf: 71, color: 'text-st-unknown' },
    { time: '14:30:11', type: 'Pipe', conf: 88, color: 'text-st-warning' },
    { time: '14:28:05', type: 'Debris', conf: 82, color: 'text-cyan-acc' },
    { time: '14:25:33', type: 'Natural', conf: 91, color: 'text-st-success' },
  ];

  const pitchWidth = Math.abs(telemetry.pitch) * 10;
  const pitchLeft = telemetry.pitch < 0 ? `${50 - pitchWidth}%` : '50%';
  const rollWidth = Math.abs(telemetry.roll) * 10;
  const rollLeft = telemetry.roll < 0 ? `${50 - rollWidth}%` : '50%';

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Telemetry Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        <GlassCard className="flex-1 overflow-hidden flex flex-col">
          <h3 className="font-semibold text-tx-primary mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-acc" />
            AUV Telemetry
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-glass-bg p-3 rounded-xl border border-glass-border flex flex-col items-center justify-center">
                <Compass className="w-6 h-6 text-cyan-acc mb-2" style={{ transform: `rotate(${telemetry.heading}deg)` }} />
                <span className="text-2xl font-mono font-bold text-tx-primary">{Math.abs(telemetry.heading % 360).toFixed(0)}°</span>
                <span className="text-[10px] uppercase text-tx-secondary tracking-wider">Heading</span>
              </div>
              <div className="bg-glass-bg p-3 rounded-xl border border-glass-border flex flex-col items-center justify-center">
                <Gauge className="w-6 h-6 text-cyan-acc mb-2" />
                <span className="text-2xl font-mono font-bold text-tx-primary">{telemetry.speed.toFixed(1)}</span>
                <span className="text-[10px] uppercase text-tx-secondary tracking-wider">Knots</span>
              </div>
              <div className="bg-glass-bg p-3 rounded-xl border border-glass-border flex flex-col items-center justify-center col-span-2">
                <span className="text-3xl font-mono font-bold text-tx-primary mb-1">{telemetry.depth.toFixed(1)} m</span>
                <span className="text-[10px] uppercase text-tx-secondary tracking-wider">Current Depth</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-tx-secondary uppercase tracking-wider">Motion</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-tx-muted">Pitch</span>
                  <span className={telemetry.pitch > 0 ? 'text-st-success' : 'text-st-danger'}>{telemetry.pitch.toFixed(1)}°</span>
                </div>
                <div className="h-2 bg-glass-bg rounded-full overflow-hidden relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
                  <motion.div
                    className="h-full bg-cyan-acc absolute"
                    animate={{ width: `${pitchWidth}%`, left: pitchLeft }}
                    transition={{ type: 'spring' }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-tx-muted">Roll</span>
                  <span className={telemetry.roll > 0 ? 'text-st-success' : 'text-st-danger'}>{telemetry.roll.toFixed(1)}°</span>
                </div>
                <div className="h-2 bg-glass-bg rounded-full overflow-hidden relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
                  <motion.div
                    className="h-full bg-cyan-acc absolute"
                    animate={{ width: `${rollWidth}%`, left: rollLeft }}
                    transition={{ type: 'spring' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="flex items-center gap-2 bg-glass-bg px-3 py-2 rounded-lg border border-glass-border">
                <Battery className="w-4 h-4 text-st-success" />
                <span className="text-sm font-mono text-tx-primary">84%</span>
              </div>
              <div className="flex items-center gap-2 bg-glass-bg px-3 py-2 rounded-lg border border-glass-border">
                <Thermometer className="w-4 h-4 text-cyan-acc" />
                <span className="text-sm font-mono text-tx-primary">14°C</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Sonar Stream */}
      <div className="flex-1 flex flex-col gap-4">
        <GlassCard className="flex-1 relative overflow-hidden p-0">
          <div className="absolute inset-0 bg-[url('https://www.edgetech.com/wp-content/uploads/2018/06/Shipwreck-4200.jpg')] bg-cover bg-bottom opacity-50 mix-blend-luminosity" style={{ backgroundSize: '100% 200%', animation: 'pan 60s linear infinite' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#02080c] via-transparent to-[#02080c]" />
          <div className="absolute inset-x-0 bottom-1/4 h-0.5 bg-cyan-acc/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-cyan-acc/10 to-transparent z-0" />
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Badge variant="success" className="animate-pulse flex items-center gap-1"><Radio className="w-3 h-3" /> LIVE STREAM</Badge>
            <Badge variant="default" className="font-mono">14:32:45 UTC</Badge>
          </div>
        </GlassCard>

        {/* Live Feed */}
        <GlassCard className="h-48 overflow-hidden flex flex-col p-4">
          <h4 className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-3">Live AI Detections</h4>
          <div className="flex-1 overflow-y-auto space-y-2">
            {liveDetections.map((det, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg bg-glass-bg hover:bg-white/10 transition-colors border border-glass-border/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-tx-muted font-mono">{det.time}</span>
                  <span className={`text-sm font-semibold uppercase ${det.color}`}>{det.type} Detected</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-tx-primary">{det.conf}%</span>
                  <button className="p-1.5 hover:bg-white/10 rounded-md text-tx-secondary transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <style>{`
        @keyframes pan {
          0% { background-position: 50% 0%; }
          100% { background-position: 50% 100%; }
        }
      `}</style>
    </div>
  );
}
