import { useState } from 'react';
import { useMarisStore } from '../lib/store';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Layers, ArrowUpRight, Compass, ShieldAlert, Waves, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background-color: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 0 12px ${color};"></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

// Free Tile Layer Options
const freeTileLayers = [
  { 
    id: 'dark', 
    name: 'Dark Hydrographic', 
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    attribution: '&copy; CartoDB & OpenStreetMap' 
  },
  { 
    id: 'satellite', 
    name: 'Esri Satellite', 
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    attribution: '&copy; Esri World Imagery' 
  },
  { 
    id: 'osm', 
    name: 'OpenStreetMap', 
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    attribution: '&copy; OpenStreetMap contributors' 
  },
  { 
    id: 'voyager', 
    name: 'Carto Voyager', 
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', 
    attribution: '&copy; CartoDB' 
  }
];

// Brahmaputra River IWAI NW-2 Fairway Navigation Channel Path Coordinates
const brahmaputraFairwayChannel: [number, number][] = [
  [26.1975, 91.7200], // West Saraighat approach
  [26.1930, 91.7320], // Saraighat Bridge passage
  [26.1890, 91.7410], // Pandu Port Sector
  [26.1850, 91.7490], // Deep Channel Bend
  [26.1815, 91.7580], // Guwahati Water Front
  [26.1780, 91.7680]  // East Uzanbazar reach
];

export function Map() {
  const anomalies = useMarisStore((state) => state.anomalies);
  const setSelectedAnomalyId = useMarisStore((state) => state.setSelectedAnomalyId);
  const navigate = useNavigate();

  const [activeTileLayer, setActiveTileLayer] = useState(freeTileLayers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [showHeatmapCircles, setShowHeatmapCircles] = useState(true);
  const [showFairwayChannel, setShowFairwayChannel] = useState(true);

  // Brahmaputra River Guwahati Center
  const defaultCenterLat = 26.1880;
  const defaultCenterLng = 91.7450;

  const filteredAnomalies = anomalies.filter((a) => {
    const matchesSearch = 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || a.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleInspect = (id: string) => {
    setSelectedAnomalyId(id);
    navigate('/sonar');
  };

  return (
    <div className="h-[calc(100vh-8rem)] relative flex flex-col overflow-hidden rounded-[20px] border border-glass-border shadow-glass bg-[#04111A]">
      
      {/* Top Controls Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Filter & Search Controls */}
        <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
          <GlassCard className="p-2 flex items-center gap-2 bg-black/70 backdrop-blur-md border-glass-border">
            <div className="relative">
              <Search className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Brahmaputra hazards..." 
                className="bg-black/50 border border-glass-border rounded-xl py-1.5 pl-9 pr-3 text-xs text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-cyan-acc w-52 font-medium"
              />
            </div>

            <div className="flex gap-1 border-l border-glass-border pl-2">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                    riskFilter === risk ? 'bg-cyan-acc/25 text-cyan-acc border border-cyan-acc/40' : 'text-tx-muted hover:text-tx-primary'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-2 flex items-center gap-2 bg-black/70 backdrop-blur-md border-glass-border">
            <button 
              onClick={() => setShowHeatmapCircles(!showHeatmapCircles)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showHeatmapCircles ? 'bg-cyan-acc/20 text-cyan-acc border border-cyan-acc/30' : 'text-tx-secondary hover:text-tx-primary'
              }`}
            >
              <Layers className="w-4 h-4" /> Danger Zones
            </button>
            <button 
              onClick={() => setShowFairwayChannel(!showFairwayChannel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showFairwayChannel ? 'bg-st-info/20 text-st-info border border-st-info/30' : 'text-tx-secondary hover:text-tx-primary'
              }`}
            >
              <Waves className="w-4 h-4" /> NW-2 Fairway Channel
            </button>
          </GlassCard>
        </div>

        {/* Right Base Map Switcher */}
        <GlassCard className="p-1.5 flex items-center gap-1 bg-black/70 backdrop-blur-md border-glass-border pointer-events-auto">
          <Globe className="w-4 h-4 text-cyan-acc ml-2 mr-1" />
          {freeTileLayers.map((tile) => (
            <button
              key={tile.id}
              onClick={() => setActiveTileLayer(tile)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeTileLayer.id === tile.id
                  ? 'bg-cyan-acc text-deep-ocean shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                  : 'text-tx-secondary hover:text-tx-primary hover:bg-white/10'
              }`}
            >
              {tile.name}
            </button>
          ))}
        </GlassCard>
      </div>

      {/* Main Leaflet Map Viewport */}
      <div className="flex-1 relative z-10">
        <MapContainer 
          center={[defaultCenterLat, defaultCenterLng]} 
          zoom={14} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* Active Free Tile Layer */}
          <TileLayer
            key={activeTileLayer.id}
            attribution={activeTileLayer.attribution}
            url={activeTileLayer.url}
          />

          {/* IWAI NW-2 Fairway Channel Navigation Path Overlay */}
          {showFairwayChannel && (
            <Polyline
              positions={brahmaputraFairwayChannel}
              pathOptions={{
                color: '#38BDF8',
                weight: 3,
                dashArray: '8, 8',
                opacity: 0.85
              }}
            />
          )}

          {/* Danger Heatmap Circles */}
          {showHeatmapCircles && filteredAnomalies.map((det) => (
            <Circle
              key={`circle-${det.id}`}
              center={[det.lat, det.lng]}
              radius={det.risk === 'CRITICAL' ? 150 : det.risk === 'HIGH' ? 100 : 60}
              pathOptions={{
                color: det.color,
                fillColor: det.color,
                fillOpacity: 0.2,
                weight: 1.5,
              }}
            />
          ))}

          {/* Anomaly Hazard Markers */}
          {filteredAnomalies.map((det) => (
            <Marker 
              key={det.id} 
              position={[det.lat, det.lng]} 
              icon={createCustomIcon(det.color)}
            >
              <Popup>
                <div className="bg-sec-bg/95 border border-glass-border p-3.5 rounded-2xl shadow-2xl text-tx-primary w-64 space-y-2.5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-acc font-bold text-xs">{det.id}</span>
                    <Badge variant={det.risk === 'CRITICAL' || det.risk === 'HIGH' ? 'danger' : det.risk === 'MEDIUM' ? 'warning' : 'info'}>
                      {det.risk}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{det.type}</h4>
                    <p className="text-[11px] text-tx-muted font-mono mt-0.5">Depth: {det.depth}m | Conf: {det.confidence}%</p>
                    {det.notes && <p className="text-[11px] text-tx-secondary mt-1.5 line-clamp-2 italic bg-black/30 p-2 rounded-lg">{det.notes}</p>}
                  </div>
                  <div className="pt-1 flex justify-between items-center text-[10px] font-mono text-tx-muted border-t border-glass-border">
                    <span>{det.lat.toFixed(4)}° N, {det.lng.toFixed(4)}° E</span>
                  </div>
                  <button 
                    onClick={() => handleInspect(det.id)}
                    className="w-full py-2 rounded-xl bg-cyan-acc text-deep-ocean hover:bg-cyan-acc/90 transition-colors text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                  >
                    Inspect in Acoustic Sonar <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Brahmaputra River Hydrographic Navigation HUD */}
      <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-glass-border p-3.5 rounded-2xl shadow-glass text-xs space-y-1.5 max-w-sm pointer-events-auto">
        <div className="flex items-center justify-between gap-3 text-cyan-acc font-bold">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Brahmaputra River Sector: Guwahati
          </span>
          <span className="text-[10px] font-mono bg-cyan-acc/20 px-2 py-0.5 rounded border border-cyan-acc/30">IWAI NW-2</span>
        </div>
        <p className="text-[11px] text-tx-secondary">
          Active Inland Waterway Channel 2 • Draft Limit: 2.0m • Current Discharge: ~18,500 m³/s.
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono text-tx-muted pt-1 border-t border-glass-border">
          <span className="flex items-center gap-1 text-st-danger font-semibold"><ShieldAlert className="w-3 h-3" /> Shifting Sandbar Danger Active</span>
          <span>{filteredAnomalies.length} Hazards Logged</span>
        </div>
      </div>
    </div>
  );
}
