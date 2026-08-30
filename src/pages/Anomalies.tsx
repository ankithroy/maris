import React, { useState } from 'react';
import { useMarisStore } from '../lib/store';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Filter, Download, Trash2, Search, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Anomalies() {
  const anomalies = useMarisStore((state) => state.anomalies);
  const deleteAnomalies = useMarisStore((state) => state.deleteAnomalies);
  const addAnomaly = useMarisStore((state) => state.addAnomaly);
  const setSelectedAnomalyId = useMarisStore((state) => state.setSelectedAnomalyId);
  const showToast = useMarisStore((state) => state.showToast);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // New Anomaly Form state
  const [newType, setNewType] = useState('Ghost Net');
  const [newRisk, setNewRisk] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newConfidence, setNewConfidence] = useState(92);
  const [newDepth, setNewDepth] = useState(44.0);

  // Filtered dataset
  const filteredData = anomalies.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.survey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.risk.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || item.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    deleteAnomalies(selectedIds);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      showToast('No anomaly records to export.');
      return;
    }
    const headers = ['ID', 'Type', 'Confidence (%)', 'Risk Level', 'Latitude', 'Longitude', 'Depth (m)', 'Survey ID', 'Timestamp'];
    const rows = filteredData.map((a) => [
      a.id, a.type, a.confidence, a.risk, a.lat, a.lng, a.depth, a.survey, a.time
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MARIS_Anomalies_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded successfully!');
  };

  const handleCreateAnomaly = (e: React.FormEvent) => {
    e.preventDefault();
    const colorMap: Record<string, string> = {
      'Ghost Net': '#EF4444',
      'Shipwreck': '#F97316',
      'Subsea Pipeline': '#F59E0B',
      'Communications Cable': '#A78BFA',
      'Metallic Debris': '#22D3EE',
    };

    addAnomaly({
      type: newType,
      confidence: Number(newConfidence),
      risk: newRisk,
      lat: 26.1150 + (Math.random() - 0.5) * 0.005,
      lng: 91.7085 + (Math.random() - 0.5) * 0.005,
      depth: Number(newDepth),
      survey: 'BAY-042',
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      color: colorMap[newType] || '#22D3EE',
      size: '3.0 × 5.0 m',
      box: { x: 40, y: 40, w: 20, h: 20 },
      notes: 'Manually logged anomaly target from Command Center.'
    });

    setShowAddModal(false);
  };

  const handleRowClick = (row: any) => {
    setSelectedAnomalyId(row.id);
    navigate('/sonar');
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val: string) => <span className="font-mono text-cyan-acc font-bold">{val}</span> },
    { key: 'type', label: 'Classification', render: (val: string) => <span className="font-semibold text-tx-primary">{val}</span> },
    { key: 'confidence', label: 'Confidence', render: (val: number) => <span className="font-mono">{val}%</span> },
    { key: 'risk', label: 'Risk Level', render: (val: string) => (
      <Badge variant={val === 'HIGH' || val === 'CRITICAL' ? 'danger' : val === 'MEDIUM' ? 'warning' : 'info'}>{val}</Badge>
    )},
    { key: 'lat', label: 'Coordinates', render: (_: any, row: any) => <span className="font-mono text-xs">{row.lat.toFixed(4)}°, {row.lng.toFixed(4)}°</span> },
    { key: 'depth', label: 'Depth (m)', render: (val: number) => <span className="font-mono">{val.toFixed(1)} m</span> },
    { key: 'survey', label: 'Survey ID' },
    { key: 'time', label: 'Timestamp', render: (val: string) => <span className="font-mono text-xs text-tx-muted">{val}</span> },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 relative">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ID, Type, Survey..." 
              className="bg-glass-bg border border-glass-border rounded-xl py-2 pl-9 pr-4 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-cyan-acc/50 w-full sm:w-64" 
            />
          </div>

          {/* Risk Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`px-4 py-2 rounded-xl bg-glass-bg border border-glass-border flex items-center gap-2 text-sm transition-colors ${
                riskFilter !== 'ALL' ? 'text-cyan-acc border-cyan-acc/40' : 'text-tx-secondary hover:text-tx-primary'
              }`}
            >
              <Filter className="w-4 h-4" /> 
              <span>Risk: {riskFilter}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-sec-bg border border-glass-border rounded-xl p-2 shadow-2xl z-30 space-y-1 backdrop-blur-md">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => { setRiskFilter(risk); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      riskFilter === risk ? 'bg-cyan-acc/20 text-cyan-acc' : 'text-tx-secondary hover:bg-white/5 hover:text-tx-primary'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-glass-bg hover:bg-white/10 transition-colors border border-glass-border flex items-center gap-2 text-sm text-tx-primary font-medium"
          >
            <Plus className="w-4 h-4 text-cyan-acc" /> Add Target
          </button>

          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="px-4 py-2 rounded-xl bg-st-danger/10 border border-st-danger/30 text-st-danger hover:bg-st-danger/20 transition-colors flex items-center gap-2 text-sm font-medium animate-pulse"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </button>
          )}

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-cyan-acc/10 border border-cyan-acc/30 text-cyan-acc hover:bg-cyan-acc/20 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Add New Anomaly Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sec-bg border border-glass-border rounded-2xl p-6 w-full max-w-md space-y-5 shadow-glass">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h3 className="font-bold text-lg text-tx-primary">Register New Anomaly</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-tx-muted hover:text-tx-primary"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateAnomaly} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Target Classification</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc"
                >
                  <option value="Ghost Net">Ghost Net</option>
                  <option value="Shipwreck">Shipwreck</option>
                  <option value="Subsea Pipeline">Subsea Pipeline</option>
                  <option value="Communications Cable">Communications Cable</option>
                  <option value="Metallic Debris">Metallic Debris</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Risk Severity Level</label>
                <select 
                  value={newRisk} 
                  onChange={(e) => setNewRisk(e.target.value as any)}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-tx-secondary mb-1">AI Confidence (%)</label>
                  <input 
                    type="number" 
                    min="50" 
                    max="100"
                    value={newConfidence}
                    onChange={(e) => setNewConfidence(Number(e.target.value))}
                    className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-tx-secondary mb-1">Depth (m)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={newDepth}
                    onChange={(e) => setNewDepth(Number(e.target.value))}
                    className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-glass-bg border border-glass-border text-tx-secondary hover:text-tx-primary">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-acc text-deep-ocean font-bold hover:bg-cyan-acc/90">Save Anomaly</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
