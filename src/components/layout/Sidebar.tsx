import { NavLink } from 'react-router-dom';
import { Activity, Map as MapIcon, Search, FileText, Database, Cpu, Settings, Waves, Radio, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const navItems = [
    { to: '/', icon: Activity, label: 'Overview' },
    { to: '/sonar', icon: Waves, label: 'Sonar Analysis' },
    { to: '/bathymetry', icon: Layers, label: 'Bathymetry 3D' },
    { to: '/live', icon: Radio, label: 'Live Survey' },
    { to: '/anomalies', icon: Search, label: 'Anomalies' },
    { to: '/map', icon: MapIcon, label: 'Map' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/dataset', icon: Database, label: 'Dataset' },
    { to: '/health', icon: Cpu, label: 'System Health' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 glass-panel h-[calc(100vh-2rem)] my-4 ml-4 flex-col hidden md:flex">
      <div className="p-6 border-b border-glass-border flex items-center gap-3">
        <Waves className="w-8 h-8 text-cyan-acc" />
        <div>
          <h1 className="font-bold text-xl tracking-wider text-tx-primary">MARIS</h1>
          <p className="text-[10px] text-cyan-acc uppercase tracking-widest font-semibold">Marine Intelligence</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive ? "bg-cyan-acc/10 text-cyan-acc border border-cyan-acc/20" : "text-tx-secondary hover:bg-glass-bg hover:text-tx-primary"
            )}>
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-glass-border">
        <div className="bg-glass-bg rounded-xl p-3 flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-st-success animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-st-success animate-ping opacity-50" />
          </div>
          <div>
            <p className="text-xs font-semibold text-tx-primary">MARIS-AUV-03</p>
            <p className="text-[10px] text-st-success uppercase tracking-wider">Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
