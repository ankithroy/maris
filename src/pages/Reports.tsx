import { useMarisStore } from '../lib/store';
import { GlassCard } from '../components/ui/GlassCard';
import { Download, Share2, FileCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function Reports() {
  const anomalies = useMarisStore((state) => state.anomalies);
  const showToast = useMarisStore((state) => state.showToast);

  // Calculate dynamic metrics from store
  const typeCounts: Record<string, number> = {};
  const riskCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };

  anomalies.forEach((a) => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    if (a.risk === 'CRITICAL') riskCounts.Critical += 1;
    else if (a.risk === 'HIGH') riskCounts.High += 1;
    else if (a.risk === 'MEDIUM') riskCounts.Medium += 1;
    else riskCounts.Low += 1;
  });

  const typeColorMap: Record<string, string> = {
    'Ghost Net': '#EF4444',
    'Shipwreck': '#F97316',
    'Subsea Pipeline': '#F59E0B',
    'Communications Cable': '#A78BFA',
    'Metallic Debris': '#22D3EE',
  };

  const typeData = Object.keys(typeCounts).map((name) => ({
    name,
    value: typeCounts[name],
    color: typeColorMap[name] || '#22D3EE',
  }));

  const riskData = [
    { name: 'Low', count: riskCounts.Low, color: '#38BDF8' },
    { name: 'Medium', count: riskCounts.Medium, color: '#F59E0B' },
    { name: 'High', count: riskCounts.High, color: '#EF4444' },
    { name: 'Critical', count: riskCounts.Critical, color: '#991B1B' },
  ];

  const handleDownloadReport = () => {
    window.print();
    showToast('Survey Report generated for export/print.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Report sharing link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-tx-primary tracking-tight">Survey Executive Report: BAY-042</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-acc/10 text-cyan-acc border border-cyan-acc/20 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>
          <p className="text-tx-secondary text-sm">Generated on {new Date().toISOString().slice(0, 10)} UTC • MARIS Autonomous Survey Mission</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-glass-bg hover:bg-white/10 transition-colors border border-glass-border flex items-center gap-2 text-sm text-tx-secondary hover:text-tx-primary"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
          <button 
            onClick={handleDownloadReport}
            className="px-5 py-2.5 rounded-xl bg-cyan-acc text-deep-ocean font-bold hover:bg-cyan-acc/90 transition-colors flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <Download className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-xs text-tx-muted uppercase tracking-wider mb-1 font-semibold">Area Covered</p>
          <p className="text-2xl font-bold text-tx-primary">1,284 km²</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-tx-muted uppercase tracking-wider mb-1 font-semibold">Total Distance</p>
          <p className="text-2xl font-bold text-tx-primary">45.2 nmi</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-tx-muted uppercase tracking-wider mb-1 font-semibold">Total Logged Anomalies</p>
          <p className="text-2xl font-bold text-cyan-acc">{anomalies.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-tx-muted uppercase tracking-wider mb-1 font-semibold">High / Critical Risk</p>
          <p className="text-2xl font-bold text-st-danger">{riskCounts.High + riskCounts.Critical}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-80 flex flex-col p-6">
          <h3 className="font-bold text-tx-primary mb-4 text-sm uppercase tracking-wider">Target Classification Breakdown</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {typeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(11,36,50,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-bold text-tx-primary font-mono">{anomalies.length}</span>
              <span className="text-xs text-tx-muted uppercase font-semibold">Anomalies</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {typeData.map((type) => (
              <div key={type.name} className="flex items-center gap-1.5 text-xs font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: type.color }} />
                <span className="text-tx-secondary">{type.name} ({type.value})</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="h-80 flex flex-col p-6">
          <h3 className="font-bold text-tx-primary mb-4 text-sm uppercase tracking-wider">Risk Level Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: '#CBD5E1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: '#CBD5E1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(11,36,50,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
