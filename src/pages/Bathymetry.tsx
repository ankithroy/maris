import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricCard } from '../components/ui/MetricCard';
import { 
  Layers, 
  SlidersHorizontal, 
  Maximize2, 
  Compass, 
  Eye, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  Download,
  Crosshair,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { motion } from 'framer-motion';

// Mock cross-sectional bathymetric depth profile along a 5km survey transect
const bathymetryProfileData = [
  { distance: 0.0, depth: 32.5, sediment: 'Silty Sand', risk: 'NORMAL' },
  { distance: 0.4, depth: 38.0, sediment: 'Silty Sand', risk: 'NORMAL' },
  { distance: 0.8, depth: 45.2, sediment: 'Fine Gravel', risk: 'NORMAL' },
  { distance: 1.2, depth: 62.8, sediment: 'Rocky Bedrock', risk: 'NORMAL' },
  { distance: 1.6, depth: 84.1, sediment: 'Rocky Bedrock', risk: 'ANOMALY', label: 'ANM-000185 (Shipwreck)' },
  { distance: 2.0, depth: 88.5, sediment: 'Coarse Sand', risk: 'NORMAL' },
  { distance: 2.4, depth: 74.3, sediment: 'Coarse Sand', risk: 'NORMAL' },
  { distance: 2.8, depth: 52.0, sediment: 'Clay & Mud', risk: 'ANOMALY', label: 'ANM-000184 (Ghost Net)' },
  { distance: 3.2, depth: 46.8, sediment: 'Clay & Mud', risk: 'NORMAL' },
  { distance: 3.6, depth: 55.4, sediment: 'Subsea Ridge', risk: 'NORMAL' },
  { distance: 4.0, depth: 71.0, sediment: 'Subsea Ridge', risk: 'ANOMALY', label: 'ANM-000186 (Pipeline)' },
  { distance: 4.4, depth: 68.2, sediment: 'Fine Sand', risk: 'NORMAL' },
  { distance: 4.8, depth: 58.0, sediment: 'Fine Sand', risk: 'NORMAL' },
  { distance: 5.0, depth: 51.5, sediment: 'Fine Sand', risk: 'NORMAL' },
];

const colorPalettes = [
  { id: 'deep-sea', name: 'Deep Sea Cyan', gradient: 'from-cyan-500 via-blue-700 to-slate-950', hex: '#22D3EE' },
  { id: 'thermal', name: 'Multi-Thermal', gradient: 'from-red-500 via-yellow-500 to-indigo-950', hex: '#EF4444' },
  { id: 'emerald', name: 'Emerald Abyss', gradient: 'from-emerald-400 via-teal-700 to-emerald-950', hex: '#10B981' },
  { id: 'neon', name: 'Neon Cyber', gradient: 'from-fuchsia-500 via-purple-700 to-slate-950', hex: '#E879F9' },
  { id: 'mono', name: 'High-Contrast Mono', gradient: 'from-slate-100 via-slate-500 to-slate-950', hex: '#CBD5E1' }
];

export function Bathymetry() {
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
  const [gain, setGain] = useState(75);
  const [showContours, setShowContours] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [showAUVTrack, setShowAUVTrack] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<any>(bathymetryProfileData[4]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-tx-primary tracking-tight">Bathymetry & Subsea Topography</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-acc/10 text-cyan-acc border border-cyan-acc/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 3D Acoustic Profiler
            </span>
          </div>
          <p className="text-tx-secondary text-sm mt-1">
            Multibeam echo-sounder elevation matrix, cross-sectional bathymetric depth slicing, and sub-bottom sediment profiling.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-glass-bg border border-glass-border text-tx-secondary hover:text-tx-primary hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" /> Export Point Cloud (.XYZ)
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-cyan-acc text-deep-ocean font-semibold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2">
            <Crosshair className="w-4 h-4" /> Calibrate Sonar Transducer
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Max Trench Depth" value="88.5 m" icon={TrendingDown} status="info" />
        <MetricCard title="Mean Slope Incline" value="14.2°" icon={Compass} status="info" />
        <MetricCard title="Seabed Roughness (RMS)" value="2.84 mm" icon={Activity} status="success" />
        <MetricCard title="Acoustic Backscatter" value="-24.5 dB" icon={Layers} status="info" />
        <MetricCard title="Geospatial Target Flags" value="3 Identified" icon={ShieldAlert} status="warning" />
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2/3: Interactive 2.5D Bathymetric Topography Render */}
        <GlassCard className="lg:col-span-2 flex flex-col p-6 relative overflow-hidden min-h-[460px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 z-10">
            <div>
              <h3 className="font-bold text-lg text-tx-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-acc" /> 2.5D Multibeam Elevation Matrix
              </h3>
              <p className="text-xs text-tx-muted">Transect Sector: BAY-042-NORTH • Resolution: 0.2m / grid cell</p>
            </div>
            
            {/* Color Palette Switcher */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-glass-border">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setSelectedPalette(palette)}
                  title={palette.name}
                  className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center border ${
                    selectedPalette.id === palette.id
                      ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: palette.hex }}
                />
              ))}
            </div>
          </div>

          {/* Simulated 2.5D Seabed Grid Visual Container */}
          <div className="flex-1 relative rounded-xl overflow-hidden border border-glass-border bg-[#020B12] flex flex-col items-center justify-center group">
            {/* Background Gradient Palette Simulation */}
            <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${selectedPalette.gradient} transition-all duration-500`} />
            
            {/* Topographic Contour Lines Mesh Simulation */}
            <div 
              className={`absolute inset-0 transition-opacity duration-300 ${showContours ? 'opacity-40' : 'opacity-0'}`}
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.4) 1px, transparent 1px), repeating-radial-gradient(circle at 50% 60%, transparent 0, transparent 20px, rgba(255,255,255,0.08) 21px, transparent 22px)`,
                backgroundSize: '40px 40px, 100% 100%'
              }}
            />

            {/* Isobar Contour Elevation Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none">
              <path d="M 0,200 Q 200,100 400,220 T 800,180" fill="none" stroke={selectedPalette.hex} strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 0,260 Q 250,320 500,240 T 800,290" fill="none" stroke={selectedPalette.hex} strokeWidth="2" />
              <path d="M 0,330 Q 300,280 600,360 T 800,310" fill="none" stroke={selectedPalette.hex} strokeWidth="1" strokeDasharray="6 6" />
            </svg>

            {/* AUV Flight Track Overlay */}
            {showAUVTrack && (
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-cyan-acc/80 flex justify-between items-center px-4 pointer-events-none">
                <span className="text-[10px] font-mono text-cyan-acc bg-pri-bg/80 px-2 py-0.5 rounded border border-cyan-acc/30">AUV START (0.0km)</span>
                <span className="text-[10px] font-mono text-cyan-acc bg-pri-bg/80 px-2 py-0.5 rounded border border-cyan-acc/30">TRANSECT END (5.0km)</span>
              </div>
            )}

            {/* Anomaly Interactive Hotspots */}
            {showAnomalies && (
              <>
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-[35%] left-[32%] z-20 cursor-pointer group"
                  onClick={() => setHoveredPoint(bathymetryProfileData[4])}
                >
                  <div className="w-5 h-5 rounded-full bg-st-danger/30 border-2 border-st-danger animate-ping absolute inset-0" />
                  <div className="w-5 h-5 rounded-full bg-st-danger border-2 border-white flex items-center justify-center shadow-[0_0_15px_#EF4444]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-sec-bg/95 border border-st-danger text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    <p className="font-bold text-st-danger">ANM-000185 • Shipwreck</p>
                    <p className="text-[10px] text-tx-muted">Depth: 84.1m | Sediment: Bedrock</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-[58%] left-[56%] z-20 cursor-pointer group"
                  onClick={() => setHoveredPoint(bathymetryProfileData[7])}
                >
                  <div className="w-5 h-5 rounded-full bg-st-warning/30 border-2 border-st-warning animate-ping absolute inset-0" />
                  <div className="w-5 h-5 rounded-full bg-st-warning border-2 border-white flex items-center justify-center shadow-[0_0_15px_#F59E0B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-sec-bg/95 border border-st-warning text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    <p className="font-bold text-st-warning">ANM-000184 • Ghost Net</p>
                    <p className="text-[10px] text-tx-muted">Depth: 52.0m | Sediment: Clay</p>
                  </div>
                </motion.div>
              </>
            )}

            {/* Depth Overlay HUD Legend */}
            <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-md border border-glass-border px-3 py-1.5 rounded-lg text-xs flex items-center gap-4 text-tx-secondary font-mono">
              <span>LAT: 26.1158° N</span>
              <span>LNG: 91.7086° E</span>
              <span>GAIN: {gain}%</span>
              <span className="text-cyan-acc font-semibold">PALETTE: {selectedPalette.name}</span>
            </div>
          </div>
        </GlassCard>

        {/* Right 1/3: Sonar Control & Sediment Inspection Panel */}
        <GlassCard className="flex flex-col p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-glass-border pb-4">
            <h3 className="font-bold text-tx-primary flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-acc" /> Visualizer Parameters
            </h3>
            <Maximize2 className="w-4 h-4 text-tx-muted hover:text-tx-primary cursor-pointer" />
          </div>

          {/* Gain Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-tx-secondary">Acoustic Gain Intensity</span>
              <span className="font-mono text-cyan-acc font-semibold">{gain}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={gain} 
              onChange={(e) => setGain(Number(e.target.value))}
              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-acc"
            />
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-glass-border">
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span className="text-tx-secondary">Isobar Contour Overlay</span>
              <input 
                type="checkbox" 
                checked={showContours} 
                onChange={(e) => setShowContours(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-acc cursor-pointer" 
              />
            </label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span className="text-tx-secondary">Highlight Target Anomalies</span>
              <input 
                type="checkbox" 
                checked={showAnomalies} 
                onChange={(e) => setShowAnomalies(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-acc cursor-pointer" 
              />
            </label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span className="text-tx-secondary">Show AUV Flight Track</span>
              <input 
                type="checkbox" 
                checked={showAUVTrack} 
                onChange={(e) => setShowAUVTrack(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-acc cursor-pointer" 
              />
            </label>
          </div>

          {/* Selected Point Cross-Section Inspector Card */}
          <div className="bg-pri-bg/60 border border-glass-border p-4 rounded-xl space-y-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-cyan-acc flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" /> Selected Transect Spot
            </p>
            {hoveredPoint ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-tx-muted">Distance along transect:</span>
                  <span className="font-mono text-tx-primary font-semibold">{hoveredPoint.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tx-muted">Seabed Depth:</span>
                  <span className="font-mono text-cyan-acc font-bold text-sm">-{hoveredPoint.depth} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tx-muted">Sub-bottom Sediment:</span>
                  <span className="font-medium text-tx-primary">{hoveredPoint.sediment}</span>
                </div>
                {hoveredPoint.label && (
                  <div className="mt-2 pt-2 border-t border-glass-border">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-st-danger/20 text-st-danger border border-st-danger/40 inline-block">
                      {hoveredPoint.label}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-tx-muted italic">Hover or click profile chart below to view details.</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Full-Width: Bathymetric Cross-Section Depth Slicing Chart */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-lg text-tx-primary flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-cyan-acc" /> Subsea Bathymetric Cross-Section Profile
            </h3>
            <p className="text-xs text-tx-muted">Seabed elevation cross-section along 5.0 km AUV transect path.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-acc">
              <span className="w-3 h-3 rounded-full bg-cyan-acc/30 border border-cyan-acc" /> Seabed Elevation
            </span>
            <span className="flex items-center gap-1.5 text-st-danger">
              <span className="w-2.5 h-2.5 rounded-full bg-st-danger" /> Anomaly Flags
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={bathymetryProfileData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseMove={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setHoveredPoint(e.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="bathymetryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedPalette.hex} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#04111A" stopOpacity={0.95}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis 
                dataKey="distance" 
                unit=" km" 
                stroke="rgba(255,255,255,0.4)" 
                tick={{ fill: '#CBD5E1', fontSize: 11 }}
              />
              <YAxis 
                unit=" m" 
                reversed 
                domain={[20, 100]}
                stroke="rgba(255,255,255,0.4)" 
                tick={{ fill: '#CBD5E1', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(7, 28, 40, 0.95)', 
                  borderColor: 'rgba(34, 211, 238, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}
                formatter={(value: any) => [`-${value} m`, 'Depth']}
                labelFormatter={(label: any) => `Transect Distance: ${label} km`}
              />
              <Area 
                type="monotone" 
                dataKey="depth" 
                stroke={selectedPalette.hex} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#bathymetryGradient)" 
              />
              {/* Highlight Anomaly dots on profile */}
              {bathymetryProfileData.filter(d => d.risk === 'ANOMALY').map((d, i) => (
                <ReferenceDot 
                  key={i} 
                  x={d.distance} 
                  y={d.depth} 
                  r={6} 
                  fill="#EF4444" 
                  stroke="#FFFFFF" 
                  strokeWidth={2} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
