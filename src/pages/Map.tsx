import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Search } from 'lucide-react';

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const mapData = [
  { id: 'ANM-000184', type: 'Ghost Net', risk: 'HIGH', confidence: 94, lat: 26.1158, lng: 91.7086, color: '#EF4444' },
  { id: 'ANM-000185', type: 'Shipwreck', risk: 'CRITICAL', confidence: 97, lat: 26.1160, lng: 91.7080, color: '#F97316' },
  { id: 'ANM-000186', type: 'Pipe', risk: 'MEDIUM', confidence: 88, lat: 26.1155, lng: 91.7091, color: '#F59E0B' },
  { id: 'ANM-000187', type: 'Cable', risk: 'LOW', confidence: 76, lat: 26.1145, lng: 91.7095, color: '#A78BFA' },
  { id: 'ANM-000188', type: 'Debris', risk: 'LOW', confidence: 82, lat: 26.1170, lng: 91.7075, color: '#22D3EE' },
];

export function Map() {
  const center: [number, number] = [26.1155, 91.7085];

  return (
    <div className="h-[calc(100vh-8rem)] relative rounded-[20px] overflow-hidden border border-glass-border shadow-glass flex">
      {/* Sidebar Overlay for Filters */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-4 w-72">
        <GlassCard className="p-4 bg-sfc/90 backdrop-blur-xl">
          <h3 className="font-semibold text-tx-primary mb-3">Map Intelligence</h3>
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coordinates..."
              className="w-full bg-black/20 border border-glass-border rounded-lg py-1.5 pl-9 pr-3 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-cyan-acc/50"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-tx-secondary font-medium uppercase tracking-wider mb-2">Layers</p>
            <label className="flex items-center gap-2 text-sm text-tx-primary cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-glass-border bg-black/20 text-cyan-acc" />
              Sonar Tracks
            </label>
            <label className="flex items-center gap-2 text-sm text-tx-primary cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-glass-border bg-black/20 text-cyan-acc" />
              AUV Path
            </label>
            <label className="flex items-center gap-2 text-sm text-tx-primary cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-glass-border bg-black/20 text-cyan-acc" />
              Detections
            </label>
          </div>
        </GlassCard>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-sfc z-0">
        <MapContainer
          center={center}
          zoom={16}
          style={{ height: '100%', width: '100%', background: '#04111A' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Circle
            center={center}
            radius={500}
            pathOptions={{ color: '#087EA4', fillColor: '#087EA4', fillOpacity: 0.1, weight: 1 }}
          />
          {mapData.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createCustomIcon(marker.color)}
            >
              <Popup>
                <div style={{ background: 'rgba(11,36,50,0.95)', color: '#F8FAFC', padding: '12px', borderRadius: '12px', minWidth: '200px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase', color: marker.color, marginBottom: '8px' }}>{marker.type}</h4>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#CBD5E1', marginBottom: '12px' }}>
                    <p>Conf: {marker.confidence}%</p>
                    <p>{marker.lat.toFixed(4)}° N</p>
                    <p>{marker.lng.toFixed(4)}° E</p>
                  </div>
                  <button style={{ width: '100%', padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '6px', color: '#22D3EE', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    VIEW ANALYSIS
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
