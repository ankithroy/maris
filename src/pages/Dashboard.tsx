import React from 'react';
import { MetricCard } from '../components/ui/MetricCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Activity, Map, Target, AlertTriangle, Brain, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tx-primary mb-2 tracking-tight">Marine Intelligence Command Center</h1>
          <p className="text-tx-secondary">AI-powered detection and geospatial analysis of underwater anomalies.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 rounded-xl bg-glass-bg border border-glass-border text-tx-primary hover:bg-white/10 transition-colors font-medium">Upload Sonar Data</button>
          <button className="px-5 py-2.5 rounded-xl bg-cyan-acc text-deep-ocean font-semibold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]">Start New Survey</button>
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
        <GlassCard className="lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-tx-primary">Recent Detections Feed</h3>
            <button className="text-sm text-cyan-acc hover:underline">View All</button>
          </div>
          <div className="flex-1 border border-glass-border border-dashed rounded-xl flex items-center justify-center bg-black/10">
            <p className="text-tx-muted">Geospatial overview loading...</p>
          </div>
        </GlassCard>
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="font-semibold text-lg text-tx-primary mb-4">Anomaly Distribution</h3>
          <div className="flex-1 border border-glass-border border-dashed rounded-xl flex items-center justify-center bg-black/10">
            <p className="text-tx-muted">Chart placeholder</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
