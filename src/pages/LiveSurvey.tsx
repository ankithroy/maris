import { useState, useEffect } from 'react';
import { useMarisStore } from '../lib/store';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Compass, Thermometer, Battery, ArrowUpRight, Gauge, Activity, Radio, Pause, Play, AlertOctagon, Anchor, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LiveSurvey() {
  const telemetry = useMarisStore((state) => state.telemetry);
  const updateTelemetry = useMarisStore((state) => state.updateTelemetry);
  const toggleStreaming = useMarisStore((state) => state.toggleStreaming);
  const triggerEmergencySurface = useMarisStore((state) => state.triggerEmergencySurface);
  const anomalies = useMarisStore((state) => state.anomalies);
  const setSelectedAnomalyId = useMarisStore((state) => state.setSelectedAnomalyId);
  const navigate = useNavigate();

  const [showControlsModal, setShowControlsModal] = useState(false);
  const [targetSpeed, setTargetSpeed] = useState(telemetry.speed);
  const [targetDepth, setTargetDepth] = useState(telemetry.depth);

  // Live Telemetry Ticker Simulation
  useEffect(() => {
    if (!telemetry.isStreaming || telemetry.mode === 'EMERGENCY_SURFACE') return;

    const interval = setInterval(() => {
      updateTelemetry({
        depth: Math.max(10, telemetry.depth + (Math.random() - 0.5) * 0.3),
        heading: (telemetry.heading + (Math.random() - 0.5) * 2 + 360) % 360,
        speed: Math.max(1.0, Math.min(5.0, telemetry.speed + (Math.random() - 0.5) * 0.1)),
        pitch: telemetry.pitch + (Math.random() - 0.5) * 0.4,
        roll: telemetry.roll + (Math.random() - 0.5) * 0.4,
        heave: telemetry.heave + (Math.random() - 0.5) * 0.1,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [telemetry, updateTelemetry]);

  const pitchWidth = Math.min(50, Math.abs(telemetry.pitch) * 10);
  const pitchLeft = telemetry.pitch < 0 ? `${50 - pitchWidth}%` : '50%';
  const rollWidth = Math.min(50, Math.abs(telemetry.roll) * 10);
  const rollLeft = telemetry.roll < 0 ? `${50 - rollWidth}%` : '50%';

  const handleInspectTarget = (id: string) => {
    setSelectedAnomalyId(id);
    navigate('/sonar');
  };

  const handleApplyControls = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelemetry({ speed: targetSpeed, depth: targetDepth });
    setShowControlsModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
      {/* Telemetry Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <GlassCard className="flex-1 overflow-hidden flex flex-col p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <h3 className="font-semibold text-tx-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-acc" />
              AUV Telemetry
            </h3>
            <button 
              onClick={() => setShowControlsModal(true)}
              className="p-1.5 rounded-lg bg-glass-bg border border-glass-border hover:bg-white/10 text-tx-secondary hover:text-tx-primary transition-colors"
              title="Vehicle Setpoint Controls"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto pr-1">
            {/* Primary Gauges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-xl border border-glass-border flex flex-col items-center justify-center">
                <Compass className="w-6 h-6 text-cyan-acc mb-1 transition-transform duration-500" style={{ transform: `rotate(${telemetry.heading}deg)` }} />
                <span className="text-2xl font-mono font-bold text-tx-primary">{Math.abs(telemetry.heading % 360).toFixed(0)}°</span>
                <span className="text-[10px] uppercase text-tx-muted font-semibold tracking-wider">Heading</span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-glass-border flex flex-col items-center justify-center">
                <Gauge className="w-6 h-6 text-cyan-acc mb-1" />
                <span className="text-2xl font-mono font-bold text-tx-primary">{telemetry.speed.toFixed(1)}</span>
                <span className="text-[10px] uppercase text-tx-muted font-semibold tracking-wider">Knots</span>
              </div>
              <div className="bg-black/30 p-3.5 rounded-xl border border-glass-border flex flex-col items-center justify-center col-span-2">
                <span className="text-3xl font-mono font-bold text-cyan-acc mb-0.5">-{telemetry.depth.toFixed(1)} m</span>
                <span className="text-[10px] uppercase text-tx-muted font-semibold tracking-wider">Depth Below Surface</span>
              </div>
            </div>

            {/* Motion Attitude */}
            <div className="space-y-3 pt-2 border-t border-glass-border">
              <h4 className="text-xs font-semibold text-tx-secondary uppercase tracking-wider">Attitude Dynamics</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-tx-muted">Pitch</span>
                  <span className={telemetry.pitch > 0 ? 'text-st-success font-bold' : 'text-st-danger font-bold'}>{telemetry.pitch.toFixed(1)}°</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden relative border border-glass-border">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 z-10" />
                  <motion.div
                    className="h-full bg-cyan-acc absolute"
                    animate={{ width: `${pitchWidth}%`, left: pitchLeft }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-tx-muted">Roll</span>
                  <span className={telemetry.roll > 0 ? 'text-st-success font-bold' : 'text-st-danger font-bold'}>{telemetry.roll.toFixed(1)}°</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden relative border border-glass-border">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 z-10" />
                  <motion.div
                    className="h-full bg-cyan-acc absolute"
                    animate={{ width: `${rollWidth}%`, left: rollLeft }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                </div>
              </div>
            </div>

            {/* Power & Temp */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-glass-border">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-xl border border-glass-border">
                <Battery className="w-4 h-4 text-st-success" />
                <span className="text-sm font-mono font-bold text-tx-primary">{telemetry.battery}%</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-xl border border-glass-border">
                <Thermometer className="w-4 h-4 text-cyan-acc" />
                <span className="text-sm font-mono font-bold text-tx-primary">{telemetry.temperature}°C</span>
              </div>
            </div>

            {/* Emergency & Pause Stream Controls */}
            <div className="space-y-2 pt-2 border-t border-glass-border">
              <button 
                onClick={toggleStreaming}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  telemetry.isStreaming 
                    ? 'bg-glass-bg border-glass-border text-tx-secondary hover:bg-white/10' 
                    : 'bg-st-success/20 border-st-success/40 text-st-success hover:bg-st-success/30'
                }`}
              >
                {telemetry.isStreaming ? <><Pause className="w-4 h-4" /> Pause Telemetry Stream</> : <><Play className="w-4 h-4" /> Resume Telemetry Stream</>}
              </button>

              <button 
                onClick={triggerEmergencySurface}
                className="w-full py-2.5 rounded-xl bg-st-danger/20 border border-st-danger/40 text-st-danger hover:bg-st-danger/30 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" /> Emergency Surface Ascent
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Sonar Stream & Feed */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Animated Sonar Waterfall Scanner Display */}
        <GlassCard className="flex-1 relative overflow-hidden p-0 min-h-[340px] flex items-center justify-center bg-[#020B12]">
          {/* Simulated Scanner Line animation */}
          {telemetry.isStreaming && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-acc to-transparent shadow-[0_0_20px_#22D3EE] z-20 animate-pulse top-1/3" />
          )}

          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />

          <div className="text-center z-10 space-y-2">
            <Radio className={`w-12 h-12 text-cyan-acc mx-auto ${telemetry.isStreaming ? 'animate-ping' : 'opacity-40'}`} />
            <p className="font-mono text-sm font-bold text-cyan-acc uppercase tracking-widest">
              {telemetry.isStreaming ? `LIVE STREAM ACTIVE • ${telemetry.mode}` : 'STREAM PAUSED'}
            </p>
            <p className="text-xs text-tx-muted font-mono">AUV Transducer Array #03 • 450 kHz Chirp</p>
          </div>

          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Badge variant={telemetry.isStreaming ? 'success' : 'warning'} className="flex items-center gap-1">
              <Radio className="w-3 h-3" /> {telemetry.isStreaming ? 'LIVE TRANSMISSION' : 'PAUSED'}
            </Badge>
            <Badge variant="default" className="font-mono">{new Date().toISOString().slice(11, 19)} UTC</Badge>
          </div>
        </GlassCard>

        {/* Live Detected Anomalies Feed */}
        <GlassCard className="h-56 overflow-hidden flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-tx-primary uppercase tracking-wider flex items-center gap-2">
              <Anchor className="w-4 h-4 text-cyan-acc" /> Live Detected Targets
            </h4>
            <span className="text-[11px] font-mono text-tx-muted">{anomalies.length} Records Logged</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {anomalies.map((det) => (
              <motion.div
                key={det.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 hover:bg-white/5 transition-colors border border-glass-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-cyan-acc font-mono font-bold">{det.id}</span>
                  <span className="text-sm font-semibold text-tx-primary">{det.type}</span>
                  <Badge variant={det.risk === 'CRITICAL' || det.risk === 'HIGH' ? 'danger' : 'warning'}>{det.risk}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-tx-muted">Depth: {det.depth}m</span>
                  <span className="text-xs font-mono text-st-success font-bold">{det.confidence}%</span>
                  <button 
                    onClick={() => handleInspectTarget(det.id)}
                    className="p-1.5 hover:bg-cyan-acc/20 rounded-lg text-cyan-acc transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Vehicle Setpoint Modal */}
      {showControlsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sec-bg border border-glass-border rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-glass">
            <h3 className="font-bold text-lg text-tx-primary">Vehicle Flight Controls</h3>
            
            <form onSubmit={handleApplyControls} className="space-y-4 text-sm">
              <div>
                <label className="flex justify-between text-xs text-tx-secondary mb-1">
                  <span>Target Cruise Speed (Knots)</span>
                  <span className="font-mono text-cyan-acc font-bold">{targetSpeed.toFixed(1)}</span>
                </label>
                <input 
                  type="range" min="1.0" max="6.0" step="0.2" value={targetSpeed}
                  onChange={(e) => setTargetSpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-acc"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs text-tx-secondary mb-1">
                  <span>Depth Setpoint (Meters)</span>
                  <span className="font-mono text-cyan-acc font-bold">{targetDepth.toFixed(1)} m</span>
                </label>
                <input 
                  type="range" min="5.0" max="100.0" step="1.0" value={targetDepth}
                  onChange={(e) => setTargetDepth(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-acc"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-glass-border">
                <button type="button" onClick={() => setShowControlsModal(false)} className="px-4 py-2 rounded-xl bg-glass-bg text-tx-secondary">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-acc text-deep-ocean font-bold">Apply Setpoints</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
