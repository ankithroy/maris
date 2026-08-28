import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Bell, Shield, Sliders, Database, Save } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-tx-primary">System Settings</h2><p className="text-tx-secondary text-sm">Configure MARIS parameters and operator preferences</p></div>
        <button className="px-4 py-2 rounded-lg bg-cyan-acc text-deep-ocean font-semibold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> Save Changes</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-acc/10 text-cyan-acc border border-cyan-acc/20 transition-all font-medium text-sm text-left"><Sliders className="w-4 h-4" /> Detection Parameters</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-glass-bg text-tx-secondary hover:text-tx-primary transition-all font-medium text-sm text-left"><Bell className="w-4 h-4" /> Alerts & Notifications</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-glass-bg text-tx-secondary hover:text-tx-primary transition-all font-medium text-sm text-left"><Database className="w-4 h-4" /> Data Management</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-glass-bg text-tx-secondary hover:text-tx-primary transition-all font-medium text-sm text-left"><Shield className="w-4 h-4" /> Security & Access</button>
        </div>
        <div className="col-span-3 space-y-6">
          <GlassCard className="space-y-6">
            <h3 className="font-semibold text-tx-primary border-b border-glass-border pb-4">Detection Thresholds</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><label className="text-tx-secondary">Minimum Confidence Threshold</label><span className="text-tx-primary font-mono">75%</span></div>
                <input type="range" min="50" max="99" defaultValue="75" className="w-full accent-cyan-acc h-1.5 bg-glass-bg rounded-lg appearance-none cursor-pointer" />
                <p className="text-xs text-tx-muted">Objects below this confidence level will be ignored by the AI inference engine.</p>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm"><label className="text-tx-secondary">Acoustic Shadow Sensitivity</label><span className="text-tx-primary font-mono">High</span></div>
                <input type="range" min="1" max="3" defaultValue="3" className="w-full accent-cyan-acc h-1.5 bg-glass-bg rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </GlassCard>
          <GlassCard className="space-y-6">
            <h3 className="font-semibold text-tx-primary border-b border-glass-border pb-4">AI Processing</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-glass-border">
                <div><p className="text-sm font-medium text-tx-primary">Enable Continuous Learning</p><p className="text-xs text-tx-muted">Automatically flag false positives for future model training.</p></div>
                <div className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-glass-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-acc"></div></div>
              </label>
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-glass-border">
                <div><p className="text-sm font-medium text-tx-primary">Edge AI Processing</p><p className="text-xs text-tx-muted">Run initial YOLO inference directly on AUV edge compute.</p></div>
                <div className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-glass-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-acc"></div></div>
              </label>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
