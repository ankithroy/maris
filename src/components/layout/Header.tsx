import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Overview';
      case '/sonar': return 'Sonar Analysis';
      case '/live': return 'Live Survey';
      case '/anomalies': return 'Anomalies';
      case '/map': return 'Geospatial Map';
      case '/reports': return 'Reports';
      case '/dataset': return 'Dataset & Models';
      case '/health': return 'System Health';
      case '/settings': return 'Settings';
      default: return 'Command Center';
    }
  };

  return (
    <header className="h-20 glass-header flex items-center justify-between px-8 mx-4 mt-4 rounded-[20px]">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-tx-primary">{getPageTitle()}</h2>
        <div className="h-4 w-px bg-glass-border mx-2" />
        <span className="text-xs text-tx-muted uppercase tracking-wider font-mono">Survey: BAY-042</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-acc transition-colors" />
          <input type="text" placeholder="Search anomalies, coordinates..." className="bg-glass-bg border border-glass-border rounded-full py-2 pl-10 pr-4 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-cyan-acc/50 focus:ring-1 focus:ring-cyan-acc/50 transition-all w-64" />
        </div>
        <div className="flex items-center gap-3 border-l border-glass-border pl-6">
          <button className="relative p-2 rounded-full hover:bg-glass-bg transition-colors text-tx-secondary hover:text-tx-primary">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-acc" />
          </button>
          <div className="w-9 h-9 rounded-full bg-ocean-blue border border-cyan-acc/30 flex items-center justify-center cursor-pointer overflow-hidden group">
            <User className="w-5 h-5 text-cyan-acc group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
}
