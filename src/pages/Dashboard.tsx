import { MetricCard } from '../components/ui/MetricCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Activity, Map, Target, AlertTriangle, Brain, Radio, ArrowRight, ShieldAlert, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const recentDetections = [
  { id: 'ANM-000185', type: 'Shipwreck', confidence: 97.8, risk: 'CRITICAL', depth: '45.1m', time: '2 mins ago', color: '#F97316' },
  { id: 'ANM-000184', type: 'Ghost Net', confidence: 94.2, risk: 'HIGH', depth: '42.7m', time: '14 mins ago', color: '#EF4444' },
  { id: 'ANM-000186', type: 'Subsea Pipeline', confidence: 88.5, risk: 'MEDIUM', depth: '40.2m', time: '38 mins ago', color: '#F59E0B' },
  { id: 'ANM-000187', type: 'Communications Cable', confidence: 76.1, risk: 'LOW', depth: '38.5m', time: '1 hr ago', color: '#A78BFA' },
  { id: 'ANM-000188', type: 'Metallic Debris', confidence: 82.4, risk: 'LOW', depth: '35.0m', time: '2 hrs ago', color: '#22D3EE' },
];

const anomalyDistribution = [
  { name: 'Ghost Nets', value: 45, color: '#EF4444' },
  { name: 'Shipwrecks', value: 12, color: '#F97316' },
  { name: 'Pipelines', value: 85, color: '#F59E0B' },
  { name: 'Cables', value: 124, color: '#A78BFA' },
  { name: 'Debris', value: 340, color: '#22D3EE' },
];

export function Dashboard() {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tx-primary mb-1 tracking-tight">Marine Intelligence Command Center</h1>
          <p className="text-tx-secondary text-sm">AI-powered detection, acoustic sonar visualizer, and geospatial subsea analytics.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/bathymetry" className="px-5 py-2.5 rounded-xl bg-glass-bg border border-glass-border text-tx-primary hover:bg-white/10 transition-colors font-medium text-sm flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-acc" /> Bathymetry 3D
          </Link>
          <Link to="/sonar" className="px-5 py-2.5 rounded-xl bg-cyan-acc text-deep-ocean font-semibold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm flex items-center gap-2">
            <Target className="w-4 h-4" /> Sonar Studio
          </Link>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div variants={item}><MetricCard title="Active Surveys" value="12" icon={Activity} trend={8} status="info" /></motion.div>
        <motion.div variants={item}><MetricCard title="Sonar Coverage" value="1,284 km²" icon={Map} trend={12} status="info" /></motion.div>
        <motion.div variants={item}><MetricCard title="Objects Detected" value="3,842" icon={Target} trend={24} status="success" /></motion.div>
        <motion.div variants={item}><MetricCard title="High-Risk Anomalies" value="127" icon={AlertTriangle} trend={-5} status="danger" /></motion.div>
        <motion.div variants={item}><MetricCard title="AI Accuracy" value="94.7%" icon={Brain} trend={1.2} status="success" /></motion.div>
        <motion.div variants={item}><MetricCard title="AUV Status" value="3 / 4" icon={Radio} status="info" /></motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Detections Feed */}
        <GlassCard className="lg:col-span-2 flex flex-col p-6 min-h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-tx-primary flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-acc" /> Live Detections Feed
              </h3>
              <p className="text-xs text-tx-muted">Real-time object classification from active AUV telemetry feeds.</p>
            </div>
            <Link to="/anomalies" className="text-xs font-semibold text-cyan-acc hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {recentDetections.map((detection) => (
              <div 
                key={detection.id}
                className="p-3.5 rounded-xl bg-glass-bg border border-glass-border hover:border-cyan-acc/40 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner"
                    style={{ backgroundColor: `${detection.color}20`, color: detection.color, border: `1px solid ${detection.color}40` }}
                  >
                    {detection.type.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-acc">{detection.id}</span>
                      <span className="font-semibold text-sm text-tx-primary">{detection.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-tx-muted mt-0.5 font-mono">
                      <span>Depth: {detection.depth}</span>
                      <span>Confidence: {detection.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={detection.risk === 'CRITICAL' || detection.risk === 'HIGH' ? 'danger' : detection.risk === 'MEDIUM' ? 'warning' : 'info'}>
                    {detection.risk}
                  </Badge>
                  <span className="text-[11px] text-tx-muted whitespace-nowrap font-mono">{detection.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Anomaly Distribution Chart */}
        <GlassCard className="flex flex-col p-6 min-h-[420px]">
          <div className="mb-2">
            <h3 className="font-bold text-lg text-tx-primary">Anomaly Category Ratios</h3>
            <p className="text-xs text-tx-muted">Percentage breakdown by detected target type.</p>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie 
                  data={anomalyDistribution} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {anomalyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(11,36,50,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }} 
                  itemStyle={{ color: '#F8FAFC' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl font-bold text-tx-primary font-mono">606</span>
              <span className="text-[10px] text-tx-muted uppercase tracking-wider font-semibold">Total Targets</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-glass-border">
            {anomalyDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-tx-secondary text-[11px] font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
