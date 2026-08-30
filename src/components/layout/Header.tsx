import { Search, Bell, User, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMarisStore } from '../../lib/store';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = useMarisStore((state) => state.userEmail);
  const logout = useMarisStore((state) => state.logout);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Overview';
      case '/sonar': return 'Sonar Analysis';
      case '/bathymetry': return 'Bathymetry 3D';
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

  const handleUserClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 glass-header flex items-center justify-between px-8 mx-4 mt-4 rounded-[20px]">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-tx-primary">{getPageTitle()}</h2>
        <div className="h-4 w-px bg-glass-border mx-2" />
        <span className="text-xs text-tx-muted uppercase tracking-wider font-mono">Survey: BRAHMAPUTRA-SEC-01</span>
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
          
          <div 
            onClick={handleUserClick}
            className="flex items-center gap-2.5 bg-black/30 border border-glass-border hover:border-cyan-acc/40 px-3 py-1.5 rounded-full cursor-pointer transition-colors group"
            title="Sign Out / Open Access Portal"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-acc/20 border border-cyan-acc/40 flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-cyan-acc group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-mono font-medium text-tx-secondary group-hover:text-tx-primary">
              {userEmail ? userEmail.split('@')[0] : 'Sign In'}
            </span>
            <LogOut className="w-3.5 h-3.5 text-tx-muted group-hover:text-cyan-acc ml-1" />
          </div>
        </div>
      </div>
    </header>
  );
}
