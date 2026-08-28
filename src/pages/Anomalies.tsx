import React from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Filter, Download, Trash2, Search } from 'lucide-react';

const mockData = [
  { id: 'ANM-000184', type: 'Ghost Net', conf: 94.2, risk: 'HIGH', lat: 26.1158, lng: 91.7086, depth: 42.7, survey: 'BAY-042', time: '2026-08-28 14:32:18' },
  { id: 'ANM-000185', type: 'Shipwreck', conf: 97.8, risk: 'CRITICAL', lat: 26.1160, lng: 91.7080, depth: 45.1, survey: 'BAY-042', time: '2026-08-28 14:10:05' },
  { id: 'ANM-000186', type: 'Pipe', conf: 88.5, risk: 'MEDIUM', lat: 26.1155, lng: 91.7091, depth: 40.2, survey: 'BAY-041', time: '2026-08-27 09:15:22' },
  { id: 'ANM-000187', type: 'Cable', conf: 76.1, risk: 'LOW', lat: 26.1145, lng: 91.7095, depth: 38.5, survey: 'BAY-041', time: '2026-08-27 10:20:11' },
  { id: 'ANM-000188', type: 'Debris', conf: 82.4, risk: 'LOW', lat: 26.1170, lng: 91.7075, depth: 35.0, survey: 'BAY-042', time: '2026-08-28 15:05:44' },
];

export function Anomalies() {
  const columns = [
    { key: 'id', label: 'ID', render: (val: string) => <span className="font-mono text-cyan-acc">{val}</span> },
    { key: 'type', label: 'Classification', render: (val: string) => <span className="font-semibold text-tx-primary">{val}</span> },
    { key: 'conf', label: 'Confidence', render: (val: number) => <span className="font-mono">{val}%</span> },
    { key: 'risk', label: 'Risk Level', render: (val: string) => (
      <Badge variant={val === 'HIGH' || val === 'CRITICAL' ? 'danger' : val === 'MEDIUM' ? 'warning' : 'info'}>{val}</Badge>
    )},
    { key: 'lat', label: 'Coordinates', render: (_: any, row: any) => <span className="font-mono text-xs">{row.lat.toFixed(4)}°, {row.lng.toFixed(4)}°</span> },
    { key: 'depth', label: 'Depth (m)', render: (val: number) => <span className="font-mono">{val.toFixed(1)}</span> },
    { key: 'survey', label: 'Survey ID' },
    { key: 'time', label: 'Timestamp', render: (val: string) => <span className="font-mono text-xs text-tx-muted">{val}</span> },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Filter anomalies..." className="bg-glass-bg border border-glass-border rounded-lg py-2 pl-9 pr-4 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-cyan-acc/50 w-64" />
          </div>
          <button className="px-4 py-2 rounded-lg bg-glass-bg hover:bg-white/10 transition-colors border border-glass-border flex items-center gap-2 text-sm text-tx-secondary hover:text-tx-primary"><Filter className="w-4 h-4" /> Filters</button>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg hover:bg-white/10 transition-colors border border-glass-border flex items-center gap-2 text-sm text-tx-secondary hover:text-tx-primary"><Trash2 className="w-4 h-4 text-st-danger" /> Delete</button>
          <button className="px-4 py-2 rounded-lg bg-cyan-acc/10 border border-cyan-acc/30 text-cyan-acc hover:bg-cyan-acc/20 transition-colors flex items-center gap-2 text-sm font-medium"><Download className="w-4 h-4" /> Export CSV</button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden"><DataTable columns={columns} data={mockData} /></div>
    </div>
  );
}
