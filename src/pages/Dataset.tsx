import { useState } from 'react';
import { useMarisStore } from '../lib/store';
import { GlassCard } from '../components/ui/GlassCard';
import { Database, Network, Cpu, Upload, CheckCircle2, X } from 'lucide-react';

const models = [
  { id: 'yolo-v1.4', name: 'MARIS-YOLO v1.4', mAP: '94.7%', precision: '95.1%', recall: '92.8%', f1: '93.9%', latency: '42ms' },
  { id: 'marinenet-v2', name: 'MarineNet ResNet-50', mAP: '96.2%', precision: '97.0%', recall: '94.5%', f1: '95.7%', latency: '68ms' },
  { id: 'underwatersam', name: 'UnderwaterSAM-ViT', mAP: '98.1%', precision: '98.5%', recall: '97.2%', f1: '97.8%', latency: '110ms' },
];

export function Dataset() {
  const showToast = useMarisStore((state) => state.showToast);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [datasetName, setDatasetName] = useState('BAY-042-SIDESCAN-SET');

  const handleUploadDataset = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUploadModal(false);
    showToast(`Dataset "${datasetName}" uploaded and queued for model fine-tuning!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-tx-primary tracking-tight">Dataset & Model Performance</h2>
          <p className="text-tx-secondary text-sm">Active AI Model: <span className="text-cyan-acc font-semibold">{selectedModel.name}</span></p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-cyan-acc text-deep-ocean font-bold hover:bg-cyan-acc/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload New Dataset
        </button>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex flex-wrap gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => { setSelectedModel(model); showToast(`Active model switched to ${model.name}`); }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              selectedModel.id === model.id
                ? 'bg-cyan-acc/20 border-cyan-acc/40 text-cyan-acc shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'bg-glass-bg border-glass-border text-tx-secondary hover:text-tx-primary hover:bg-white/10'
            }`}
          >
            <Network className="w-4 h-4" /> {model.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="space-y-5 p-6">
          <div className="flex items-center gap-2 text-tx-primary font-bold border-b border-glass-border pb-3">
            <Database className="w-5 h-5 text-cyan-acc" /> Training Dataset (MARIS-Underwater-DB)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 p-3.5 rounded-xl border border-glass-border">
              <p className="text-xs text-tx-muted mb-1 font-semibold">Total Sonar Scans</p>
              <p className="font-mono text-2xl font-bold text-tx-primary">124,580</p>
            </div>
            <div className="bg-black/30 p-3.5 rounded-xl border border-glass-border">
              <p className="text-xs text-tx-muted mb-1 font-semibold">Annotated Bounding Boxes</p>
              <p className="font-mono text-2xl font-bold text-cyan-acc">124,580</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-tx-secondary">Dataset Split Ratio</p>
            <div className="flex h-3 rounded-full overflow-hidden border border-glass-border">
              <div className="bg-cyan-acc w-[70%]" title="Train 70%" />
              <div className="bg-st-warning w-[20%]" title="Val 20%" />
              <div className="bg-st-success w-[10%]" title="Test 10%" />
            </div>
            <div className="flex justify-between text-xs text-tx-secondary font-mono pt-1">
              <span>Train: 70%</span>
              <span>Validation: 20%</span>
              <span>Test: 10%</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-5 p-6">
          <div className="flex items-center gap-2 text-tx-primary font-bold border-b border-glass-border pb-3">
            <Network className="w-5 h-5 text-cyan-acc" /> Active Metrics ({selectedModel.name})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/30 p-3 rounded-xl border border-glass-border text-center">
              <p className="text-[11px] text-tx-muted mb-1 font-semibold uppercase">mAP@50</p>
              <p className="font-mono font-bold text-lg text-st-success">{selectedModel.mAP}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-glass-border text-center">
              <p className="text-[11px] text-tx-muted mb-1 font-semibold uppercase">Precision</p>
              <p className="font-mono font-bold text-lg text-st-success">{selectedModel.precision}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-glass-border text-center">
              <p className="text-[11px] text-tx-muted mb-1 font-semibold uppercase">Recall</p>
              <p className="font-mono font-bold text-lg text-st-warning">{selectedModel.recall}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-glass-border text-center">
              <p className="text-[11px] text-tx-muted mb-1 font-semibold uppercase">F1 Score</p>
              <p className="font-mono font-bold text-lg text-st-success">{selectedModel.f1}</p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-glass-border">
            <div className="flex items-center gap-2 text-sm text-tx-secondary font-medium">
              <Cpu className="w-4 h-4 text-cyan-acc" /> TensorRT Inference Latency
            </div>
            <span className="font-mono font-bold text-cyan-acc text-base">{selectedModel.latency}</span>
          </div>
        </GlassCard>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sec-bg border border-glass-border rounded-2xl p-6 w-full max-w-md space-y-5 shadow-glass">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h3 className="font-bold text-lg text-tx-primary flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-acc" /> Upload Sonar Dataset Bundle
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-tx-muted hover:text-tx-primary"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUploadDataset} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Dataset Package Name</label>
                <input 
                  type="text" 
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full bg-pri-bg border border-glass-border rounded-xl p-2.5 text-tx-primary focus:outline-none focus:border-cyan-acc font-mono"
                />
              </div>

              <div className="border-2 border-dashed border-cyan-acc/40 rounded-xl p-6 text-center bg-black/20">
                <CheckCircle2 className="w-8 h-8 text-cyan-acc mx-auto mb-2 opacity-80" />
                <p className="text-xs text-tx-secondary">Upload COCO or Pascal VOC formatted zip file</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-glass-border">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 rounded-xl bg-glass-bg text-tx-secondary">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-acc text-deep-ocean font-bold">Ingest Dataset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
