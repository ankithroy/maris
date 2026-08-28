import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Download, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const typeData = [
  { name: 'Ghost Nets', value: 45, color: '#EF4444' },
  { name: 'Shipwrecks', value: 12, color: '#F97316' },
  { name: 'Pipes', value: 85, color: '#F59E0B' },
  { name: 'Cables', value: 124, color: '#A78BFA' },
  { name: 'Debris', value: 340, color: '#22D3EE' },
];
const riskData = [
  { name: 'Low', count: 420, color: '#38BDF8' },
  { name: 'Medium', count: 156, color: '#F59E0B' },
  { name: 'High', count: 24, color: '#EF4444' },
  { name: 'Critical', count: 6, color: '#991B1B' },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-tx-primary">Survey Report: BAY-042</h2>
          <p className="text-tx-secondary text-sm">Generated on 2026-08-28 14:45 UTC</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg hover:bg-white/10 transition-colors border border-glass-border flex items-center gap-2 text-sm text-tx-secondary hover:text-tx-primary"><Share2 className="w-4 h-4" /> Share</button>
          <button className="px-4 py-2 rounded-lg bg-cyan-acc/10 border border-cyan-acc/30 text-cyan-acc hover:bg-cyan-acc/20 transition-colors flex items-center gap-2 text-sm font-medium"><Download className="w-4 h-4" /> Download PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4"><p className="text-xs text-tx-muted uppercase tracking-wider mb-1">Area Covered</p><p className="text-2xl font-semibold text-tx-primary">128 km²</p></GlassCard>
        <GlassCard className="p-4"><p className="text-xs text-tx-muted uppercase tracking-wider mb-1">Total Distance</p><p className="text-2xl font-semibold text-tx-primary">45.2 nmi</p></GlassCard>
        <GlassCard className="p-4"><p className="text-xs text-tx-muted uppercase tracking-wider mb-1">Total Anomalies</p><p className="text-2xl font-semibold text-tx-primary">606</p></GlassCard>
        <GlassCard className="p-4"><p className="text-xs text-tx-muted uppercase tracking-wider mb-1">High Risk</p><p className="text-2xl font-semibold text-st-danger">30</p></GlassCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-semibold text-tx-primary mb-4 text-sm uppercase tracking-wider">Detection Types</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {typeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(11,36,50,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-bold text-tx-primary">606</span>
              <span className="text-xs text-tx-secondary uppercase">Objects</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {typeData.map((type) => (<div key={type.name} className="flex items-center gap-1.5 text-xs"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: type.color }} /><span className="text-tx-secondary">{type.name}</span></div>))}
          </div>
        </GlassCard>
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-semibold text-tx-primary mb-4 text-sm uppercase tracking-wider">Risk Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(11,36,50,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>{riskData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
