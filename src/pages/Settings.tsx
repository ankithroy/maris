import React, { useState } from 'react';
import { useMarisStore } from '../lib/store';
import { GlassCard } from '../components/ui/GlassCard';
import { Bell, Shield, Sliders, Save } from 'lucide-react';

export function Settings() {
  const systemSettings = useMarisStore((state) => state.systemSettings);
  const updateSystemSettings = useMarisStore((state) => state.updateSystemSettings);

  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(systemSettings.aiConfidenceThreshold);
  const [autoSaveInterval, setAutoSaveInterval] = useState(systemSettings.autoSaveInterval);
  const [enableAlerts, setEnableAlerts] = useState(systemSettings.enableAlerts);
  const [telemetryRate, setTelemetryRate] = useState(systemSettings.telemetryRate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      aiConfidenceThreshold,
      autoSaveInterval,
      enableAlerts,
      telemetryRate,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-tx-primary tracking-tight">System Settings & Configuration</h2>
          <p className="text-tx-secondary text-sm">Configure detection sensitivity, telemetry rates, and security parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Detection Parameters */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-2 font-bold text-tx-primary text-base border-b border-glass-border pb-3">
              <Sliders className="w-5 h-5 text-cyan-acc" /> AI Detection Parameters
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-tx-secondary font-semibold">Minimum Confidence Threshold (%)</span>
                <span className="font-mono text-cyan-acc font-bold">{aiConfidenceThreshold}%</span>
              </div>
              <input 
                type="range" min="50" max="95" step="1"
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-acc"
              />
              <p className="text-[11px] text-tx-muted">Detections below this threshold will be flagged as unverified targets.</p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-tx-secondary">Telemetry Refresh Rate</label>
              <select 
                value={telemetryRate}
                onChange={(e) => setTelemetryRate(Number(e.target.value))}
                className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc font-mono text-xs"
              >
                <option value={500}>500ms (High Frequency)</option>
                <option value={1000}>1000ms (Standard Baseline)</option>
                <option value={2000}>2000ms (Low Power Mode)</option>
              </select>
            </div>
          </GlassCard>

          {/* Notifications & Storage */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-2 font-bold text-tx-primary text-base border-b border-glass-border pb-3">
              <Bell className="w-5 h-5 text-cyan-acc" /> Alerts & Auto-Archiving
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="block text-sm font-semibold text-tx-primary">High-Risk Anomaly Alerts</span>
                <span className="text-xs text-tx-muted">Trigger browser notifications for Critical/High risk detections</span>
              </div>
              <input 
                type="checkbox"
                checked={enableAlerts}
                onChange={(e) => setEnableAlerts(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-acc cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-glass-border">
              <label className="block text-xs font-semibold text-tx-secondary">Telemetry Auto-Save Interval (Minutes)</label>
              <select 
                value={autoSaveInterval}
                onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc font-mono text-xs"
              >
                <option value={1}>Every 1 minute</option>
                <option value={5}>Every 5 minutes</option>
                <option value={15}>Every 15 minutes</option>
              </select>
            </div>
          </GlassCard>
        </div>

        {/* Security & Access */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-tx-primary text-base border-b border-glass-border pb-3">
            <Shield className="w-5 h-5 text-cyan-acc" /> Encryption & Security Policy
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-black/30 p-3 rounded-xl border border-glass-border flex justify-between">
              <span className="text-tx-muted">Telemetry Encryption:</span>
              <span className="text-st-success font-bold">AES-256 GCM</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-glass-border flex justify-between">
              <span className="text-tx-muted">Storage Protocol:</span>
              <span className="text-st-success font-bold">Encrypted PostGIS</span>
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-acc text-deep-ocean font-bold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_25px_rgba(34,211,238,0.35)] flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
