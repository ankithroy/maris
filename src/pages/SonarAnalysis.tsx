import { useState, useRef, useEffect } from 'react';
import { useMarisStore } from '../lib/store';
import { GlassCard } from '../components/ui/GlassCard';
import { AnomalyDetailPanel } from '../components/sonar/AnomalyDetailPanel';
import { Settings2, Maximize, ZoomIn, ZoomOut, Target, Grid3X3, Layers, Upload, Plus, X, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function SonarAnalysis() {
  const anomalies = useMarisStore((state) => state.anomalies);
  const selectedAnomalyId = useMarisStore((state) => state.selectedAnomalyId);
  const setSelectedAnomalyId = useMarisStore((state) => state.setSelectedAnomalyId);
  const addAnomaly = useMarisStore((state) => state.addAnomaly);
  const sonarSettings = useMarisStore((state) => state.sonarSettings);
  const updateSonarSettings = useMarisStore((state) => state.updateSonarSettings);
  const resetSonarZoom = useMarisStore((state) => state.resetSonarZoom);
  const showToast = useMarisStore((state) => state.showToast);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddTargetModal, setShowAddTargetModal] = useState(false);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);

  // New Target Modal state
  const [newType, setNewType] = useState('Ghost Net');
  const [newRisk, setNewRisk] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedDetection = anomalies.find((a) => a.id === selectedAnomalyId) || null;

  // Render Acoustic Sonar Canvas Pattern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 700;

    // Palette Colors
    const paletteGradients: Record<string, [string, string, string]> = {
      cyan: ['#020B12', '#087EA4', '#22D3EE'],
      emerald: ['#02120B', '#047857', '#34D399'],
      thermal: ['#0F0212', '#B91C1C', '#FBBF24'],
      amber: ['#120A02', '#B45309', '#FCD34D'],
      mono: ['#050505', '#475569', '#F8FAFC']
    };

    const colors = paletteGradients[sonarSettings.palette] || paletteGradients.cyan;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, colors[0]);
    bgGrad.addColorStop(0.5, colors[1]);
    bgGrad.addColorStop(1, colors[0]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Acoustic Waterfall Pattern Simulation
    ctx.fillStyle = colors[2];
    ctx.globalAlpha = Math.min(1, sonarSettings.gain / 100);

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 6) {
        const noise = Math.sin(x * 0.02 + y * 0.05) * Math.cos(x * 0.01 - y * 0.03);
        if (noise > 0.45) {
          const alpha = (noise - 0.45) * 2 * (sonarSettings.contrast / 60);
          ctx.globalAlpha = Math.min(1, Math.max(0.05, alpha));
          ctx.fillRect(x, y, 4, 3);
        }
      }
    }

    // Grid lines
    if (sonarSettings.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1.0;
  }, [sonarSettings]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setClickPos({ x: Math.max(5, Math.min(85, xPct)), y: Math.max(5, Math.min(85, yPct)) });
    setShowAddTargetModal(true);
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickPos) return;

    const colorMap: Record<string, string> = {
      'Ghost Net': '#EF4444',
      'Shipwreck': '#F97316',
      'Subsea Pipeline': '#F59E0B',
      'Communications Cable': '#A78BFA',
      'Metallic Debris': '#22D3EE',
    };

    addAnomaly({
      type: newType,
      confidence: 96.5,
      risk: newRisk,
      lat: 26.1158 + (Math.random() - 0.5) * 0.004,
      lng: 91.7086 + (Math.random() - 0.5) * 0.004,
      depth: 43.5,
      survey: 'BAY-042',
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      color: colorMap[newType] || '#22D3EE',
      size: '5.0 × 8.0 m',
      box: { x: clickPos.x, y: clickPos.y, w: 18, h: 20 },
      notes: 'Interactive target dropped onto Acoustic Waterfall scan.'
    });

    setShowAddTargetModal(false);
  };

  const handleScanUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUploadModal(false);
    showToast('Sonar image uploaded and analyzed! High-confidence anomaly registered.');
  };

  return (
    <div className="h-[calc(100vh-8rem)] relative flex overflow-hidden rounded-[20px] border border-glass-border bg-[#02080c] shadow-glass">
      
      {/* Top-Left Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <GlassCard className="p-2 flex flex-col gap-2 bg-black/50 backdrop-blur-md border-glass-border">
          <button 
            onClick={() => updateSonarSettings({ zoomLevel: Math.min(2.5, sonarSettings.zoomLevel + 0.25) })}
            className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateSonarSettings({ zoomLevel: Math.max(0.75, sonarSettings.zoomLevel - 0.25) })}
            className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={resetSonarZoom}
            className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </GlassCard>

        <GlassCard className="p-2 flex flex-col gap-2 bg-black/50 backdrop-blur-md border-glass-border">
          <button 
            onClick={() => updateSonarSettings({ showOverlays: !sonarSettings.showOverlays })}
            className={cn("p-2 rounded-lg transition-colors", sonarSettings.showOverlays ? "text-cyan-acc bg-cyan-acc/10" : "text-tx-secondary hover:text-tx-primary hover:bg-white/10")}
            title="Toggle Bounding Boxes"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateSonarSettings({ showCrosshair: !sonarSettings.showCrosshair })}
            className={cn("p-2 rounded-lg transition-colors", sonarSettings.showCrosshair ? "text-cyan-acc bg-cyan-acc/10" : "text-tx-secondary hover:text-tx-primary hover:bg-white/10")}
            title="Toggle Crosshairs"
          >
            <Target className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateSonarSettings({ showGrid: !sonarSettings.showGrid })}
            className={cn("p-2 rounded-lg transition-colors", sonarSettings.showGrid ? "text-cyan-acc bg-cyan-acc/10" : "text-tx-secondary hover:text-tx-primary hover:bg-white/10")}
            title="Toggle Metric Grid"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-tx-secondary hover:text-tx-primary hover:bg-white/10 rounded-lg transition-colors"
            title="Sonar DSP Settings"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </GlassCard>

        <GlassCard className="p-2 bg-black/50 backdrop-blur-md border-glass-border">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="p-2 text-cyan-acc hover:bg-cyan-acc/20 rounded-lg transition-colors"
            title="Upload Raw Sonar Scan"
          >
            <Upload className="w-5 h-5" />
          </button>
        </GlassCard>
      </div>

      {/* Main Sonar Viewport */}
      <div 
        ref={containerRef}
        onClick={handleCanvasClick}
        className="flex-1 relative cursor-crosshair overflow-hidden flex items-center justify-center"
      >
        <div 
          className="w-full h-full transition-transform duration-200 origin-center flex items-center justify-center"
          style={{ transform: `scale(${sonarSettings.zoomLevel})` }}
        >
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* Crosshair Overlay */}
          {sonarSettings.showCrosshair && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-full h-px bg-cyan-acc" />
              <div className="h-full w-px bg-cyan-acc absolute" />
              <div className="w-24 h-24 rounded-full border border-cyan-acc absolute" />
            </div>
          )}

          {/* Dynamic Bounding Box Hotspots */}
          {sonarSettings.showOverlays && anomalies.map((detection) => {
            const box = detection.box || { x: 40, y: 40, w: 15, h: 20 };
            const isSelected = selectedDetection?.id === detection.id;
            return (
              <motion.div 
                key={detection.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "absolute border-2 transition-all cursor-pointer group flex items-start justify-start pointer-events-auto",
                  isSelected ? "z-30 border-white shadow-[0_0_25px_rgba(255,255,255,0.7)] bg-white/10" : "z-10 hover:bg-white/5"
                )}
                style={{ 
                  left: `${box.x}%`, 
                  top: `${box.y}%`, 
                  width: `${box.w}%`, 
                  height: `${box.h}%`, 
                  borderColor: isSelected ? '#FFF' : detection.color 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnomalyId(detection.id);
                }}
              >
                <div 
                  className="absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-mono font-bold uppercase whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity backdrop-blur-md border border-b-0 border-inherit"
                  style={{ 
                    backgroundColor: `${detection.color}40`, 
                    color: isSelected ? '#FFF' : detection.color, 
                    borderColor: isSelected ? '#FFF' : detection.color 
                  }}
                >
                  {detection.type} • {detection.confidence}%
                </div>
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-inherit" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-inherit" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-inherit" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-inherit" />
              </motion.div>
            );
          })}
        </div>

        {/* Viewport Info Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-glass-border px-3 py-1.5 rounded-xl text-xs font-mono text-tx-secondary z-20 flex items-center gap-4">
          <span>ZOOM: {(sonarSettings.zoomLevel * 100).toFixed(0)}%</span>
          <span>FREQ: {sonarSettings.frequency} kHz</span>
          <span>GAIN: {sonarSettings.gain}%</span>
          <span className="text-cyan-acc uppercase">PALETTE: {sonarSettings.palette}</span>
        </div>
      </div>

      {/* Detail Inspector Panel */}
      <AnomalyDetailPanel detection={selectedDetection} onClose={() => setSelectedAnomalyId(null)} />

      {/* Sonar DSP Settings Drawer Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sec-bg border border-glass-border rounded-2xl p-6 w-full max-w-md space-y-6 shadow-glass">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h3 className="font-bold text-lg text-tx-primary flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-acc" /> Sonar Acoustic DSP Controls
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 text-tx-muted hover:text-tx-primary"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-tx-secondary">Acoustic Signal Gain</span>
                  <span className="font-mono text-cyan-acc font-bold">{sonarSettings.gain}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={sonarSettings.gain} 
                  onChange={(e) => updateSonarSettings({ gain: Number(e.target.value) })}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-acc"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-tx-secondary">Contrast & Threshold Gamma</span>
                  <span className="font-mono text-cyan-acc font-bold">{sonarSettings.contrast}%</span>
                </div>
                <input 
                  type="range" min="20" max="100" value={sonarSettings.contrast} 
                  onChange={(e) => updateSonarSettings({ contrast: Number(e.target.value) })}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-acc"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Transducer Frequency (kHz)</label>
                <select 
                  value={sonarSettings.frequency} 
                  onChange={(e) => updateSonarSettings({ frequency: Number(e.target.value) })}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc font-mono"
                >
                  <option value={200}>200 kHz (Deep Water Penetration)</option>
                  <option value={450}>450 kHz (Standard Chirp Resolution)</option>
                  <option value={900}>900 kHz (Ultra High-Definition Inspection)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Acoustic Color Palette</label>
                <select 
                  value={sonarSettings.palette} 
                  onChange={(e) => updateSonarSettings({ palette: e.target.value as any })}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc"
                >
                  <option value="cyan">Deep Cyan Ocean</option>
                  <option value="emerald">Emerald Sea</option>
                  <option value="thermal">Multi-Thermal</option>
                  <option value="amber">Waterfall Amber</option>
                  <option value="mono">High-Contrast Monochromatic</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-glass-border">
              <button 
                onClick={() => updateSonarSettings({ gain: 75, contrast: 60, frequency: 450, palette: 'cyan' })}
                className="text-xs text-tx-muted hover:text-tx-primary flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
              <button onClick={() => setShowSettingsModal(false)} className="px-5 py-2 rounded-xl bg-cyan-acc text-deep-ocean font-bold">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Sonar Scan Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sec-bg border border-glass-border rounded-2xl p-6 w-full max-w-md space-y-5 shadow-glass">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h3 className="font-bold text-lg text-tx-primary flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-acc" /> Upload Raw Acoustic Scan
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-tx-muted hover:text-tx-primary"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleScanUpload} className="space-y-4">
              <div className="border-2 border-dashed border-cyan-acc/40 rounded-xl p-8 text-center bg-black/20 hover:border-cyan-acc transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-cyan-acc mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-tx-primary">Drop sonar image or raw .XTF file here</p>
                <p className="text-xs text-tx-muted mt-1">Supports PNG, JPG, XTF, JSF up to 100MB</p>
                <input type="file" className="hidden" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 rounded-xl bg-glass-bg border border-glass-border text-tx-secondary">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-acc text-deep-ocean font-bold">Run AI Segmentation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Target from Canvas Click Modal */}
      {showAddTargetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sec-bg border border-glass-border rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h3 className="font-bold text-base text-tx-primary flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-acc" /> Drop Target at Coordinate
              </h3>
              <button onClick={() => setShowAddTargetModal(false)} className="p-1 text-tx-muted hover:text-tx-primary"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateTarget} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Target Classification</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2 text-tx-primary focus:outline-none focus:border-cyan-acc"
                >
                  <option value="Ghost Net">Ghost Net</option>
                  <option value="Shipwreck">Shipwreck</option>
                  <option value="Subsea Pipeline">Subsea Pipeline</option>
                  <option value="Communications Cable">Communications Cable</option>
                  <option value="Metallic Debris">Metallic Debris</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Risk Severity</label>
                <select 
                  value={newRisk} 
                  onChange={(e) => setNewRisk(e.target.value as any)}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2 text-tx-primary focus:outline-none focus:border-cyan-acc"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-glass-border">
                <button type="button" onClick={() => setShowAddTargetModal(false)} className="px-3 py-1.5 rounded-xl bg-glass-bg text-tx-secondary text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-acc text-deep-ocean font-bold text-xs">Add Target Box</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
