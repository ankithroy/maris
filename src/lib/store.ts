import { create } from 'zustand';

export interface Anomaly {
  id: string;
  type: string;
  confidence: number;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number;
  lng: number;
  depth: number;
  survey: string;
  time: string;
  size?: string;
  color: string;
  box?: { x: number; y: number; w: number; h: number };
  notes?: string;
}

export interface SonarSettings {
  gain: number;
  contrast: number;
  frequency: number; // in kHz e.g. 450
  palette: 'cyan' | 'emerald' | 'thermal' | 'amber' | 'mono';
  showGrid: boolean;
  showCrosshair: boolean;
  showOverlays: boolean;
  zoomLevel: number;
}

export interface AUVTelemetry {
  heading: number;
  speed: number;
  depth: number;
  pitch: number;
  roll: number;
  heave: number;
  battery: number;
  temperature: number;
  isStreaming: boolean;
  mode: 'AUTONOMOUS' | 'MANUAL' | 'EMERGENCY_SURFACE';
}

export interface SystemSettings {
  aiConfidenceThreshold: number;
  autoSaveInterval: number;
  enableAlerts: boolean;
  telemetryRate: number;
  themeAccent: string;
}

interface MarisState {
  // Anomalies
  anomalies: Anomaly[];
  selectedAnomalyId: string | null;
  addAnomaly: (anomaly: Omit<Anomaly, 'id'> & { id?: string }) => void;
  deleteAnomalies: (ids: string[]) => void;
  setSelectedAnomalyId: (id: string | null) => void;

  // Sonar
  sonarSettings: SonarSettings;
  updateSonarSettings: (settings: Partial<SonarSettings>) => void;
  resetSonarZoom: () => void;

  // AUV Telemetry
  telemetry: AUVTelemetry;
  updateTelemetry: (data: Partial<AUVTelemetry>) => void;
  toggleStreaming: () => void;
  triggerEmergencySurface: () => void;

  // System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;

  // Diagnostics
  isDiagnosticRunning: boolean;
  diagnosticProgress: number;
  runDiagnostics: (onComplete?: () => void) => void;

  // Authentication
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;

  // Toast Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const initialAnomalies: Anomaly[] = [
  { 
    id: 'ANM-000185', 
    type: 'Submerged Sandbar Shoal', 
    confidence: 97.8, 
    risk: 'CRITICAL', 
    lat: 26.1895, 
    lng: 91.7420, 
    depth: 6.4, 
    survey: 'BRAHMAPUTRA-SEC-01', 
    time: '2026-08-30 08:10:05',
    size: '45.0 × 120.0 m',
    color: '#EF4444',
    box: { x: 55, y: 25, w: 30, h: 25 },
    notes: 'Rapidly shifting Brahmaputra riverbed alluvial sandbar shoal restricting vessel draft clearance.'
  },
  { 
    id: 'ANM-000184', 
    type: 'Sunken Cargo Barge (Shipwreck)', 
    confidence: 94.2, 
    risk: 'HIGH', 
    lat: 26.1920, 
    lng: 91.7350, 
    depth: 12.5, 
    survey: 'BRAHMAPUTRA-SEC-01', 
    time: '2026-08-30 09:32:18',
    size: '18.5 × 8.2 m',
    color: '#F97316',
    box: { x: 25, y: 40, w: 20, h: 22 },
    notes: 'Sunken steel-reinforced timber vessel obstructing main river navigation channel near Saraighat.'
  },
  { 
    id: 'ANM-000186', 
    type: 'Subsea Water Intake Pipe', 
    confidence: 88.5, 
    risk: 'MEDIUM', 
    lat: 26.1810, 
    lng: 91.7580, 
    depth: 9.8, 
    survey: 'BRAHMAPUTRA-SEC-03', 
    time: '2026-08-29 11:15:22',
    size: '1.8 × 40.0 m',
    color: '#F59E0B',
    box: { x: 10, y: 70, w: 40, h: 5 },
    notes: 'Guwahati Municipal water supply intake pipeline structure with concrete armor mattresses.'
  },
  { 
    id: 'ANM-000187', 
    type: 'High-Voltage Cable Line', 
    confidence: 76.1, 
    risk: 'MEDIUM', 
    lat: 26.1840, 
    lng: 91.7510, 
    depth: 18.2, 
    survey: 'BRAHMAPUTRA-SEC-02', 
    time: '2026-08-29 14:20:11',
    size: '0.4 × 350.0 m',
    color: '#A78BFA',
    box: { x: 5, y: 15, w: 50, h: 3 },
    notes: 'Riverbed power transmission line crossing from Pandu Port to North Guwahati.'
  },
  { 
    id: 'ANM-000188', 
    type: 'Derelict Fishing Trap Net (Ghost Net)', 
    confidence: 82.4, 
    risk: 'HIGH', 
    lat: 26.1870, 
    lng: 91.7480, 
    depth: 14.1, 
    survey: 'BRAHMAPUTRA-SEC-02', 
    time: '2026-08-30 10:05:44',
    size: '6.5 × 14.0 m',
    color: '#EF4444',
    box: { x: 70, y: 55, w: 15, h: 18 },
    notes: 'Heavy commercial monofilament net snagged around submerged riverbed rocky outcrop.'
  },
  { 
    id: 'ANM-000189', 
    type: 'Bridge Construction Debris', 
    confidence: 85.0, 
    risk: 'LOW', 
    lat: 26.1950, 
    lng: 91.7280, 
    depth: 8.2, 
    survey: 'BRAHMAPUTRA-SEC-01', 
    time: '2026-08-30 11:00:00',
    size: '3.5 × 4.2 m',
    color: '#22D3EE',
    box: { x: 80, y: 15, w: 12, h: 12 },
    notes: 'Submerged reinforced concrete pier fragment from old bridge caisson works.'
  },
];

export const useMarisStore = create<MarisState>((set, get) => ({
  // Anomalies
  anomalies: initialAnomalies,
  selectedAnomalyId: 'ANM-000185',
  
  addAnomaly: (newAnomaly) => {
    const nextId = newAnomaly.id || `ANM-${Math.floor(100000 + Math.random() * 900000)}`;
    const created: Anomaly = {
      ...newAnomaly,
      id: nextId,
    };
    set((state) => ({
      anomalies: [created, ...state.anomalies],
      selectedAnomalyId: created.id,
      toastMessage: `New anomaly ${created.id} registered!`
    }));
  },

  deleteAnomalies: (ids) => {
    set((state) => ({
      anomalies: state.anomalies.filter((a) => !ids.includes(a.id)),
      selectedAnomalyId: ids.includes(state.selectedAnomalyId || '') ? null : state.selectedAnomalyId,
      toastMessage: `Deleted ${ids.length} anomaly record(s).`
    }));
  },

  setSelectedAnomalyId: (id) => set({ selectedAnomalyId: id }),

  // Sonar
  sonarSettings: {
    gain: 75,
    contrast: 60,
    frequency: 450,
    palette: 'cyan',
    showGrid: true,
    showCrosshair: true,
    showOverlays: true,
    zoomLevel: 1.0,
  },

  updateSonarSettings: (settings) =>
    set((state) => ({
      sonarSettings: { ...state.sonarSettings, ...settings },
    })),

  resetSonarZoom: () =>
    set((state) => ({
      sonarSettings: { ...state.sonarSettings, zoomLevel: 1.0 },
    })),

  // Telemetry
  telemetry: {
    heading: 145,
    speed: 3.2,
    depth: 42.5,
    pitch: 2.1,
    roll: -1.5,
    heave: 0.2,
    battery: 84,
    temperature: 14,
    isStreaming: true,
    mode: 'AUTONOMOUS',
  },

  updateTelemetry: (data) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...data },
    })),

  toggleStreaming: () =>
    set((state) => {
      const nextStream = !state.telemetry.isStreaming;
      return {
        telemetry: { ...state.telemetry, isStreaming: nextStream },
        toastMessage: nextStream ? 'Live telemetry stream resumed.' : 'Live stream paused.'
      };
    }),

  triggerEmergencySurface: () =>
    set((state) => ({
      telemetry: { ...state.telemetry, mode: 'EMERGENCY_SURFACE', speed: 0, pitch: 15.0 },
      toastMessage: 'EMERGENCY SURFACE TRIGGERED! AUV ascending to 0m depth.'
    })),

  // Settings
  systemSettings: {
    aiConfidenceThreshold: 75,
    autoSaveInterval: 5,
    enableAlerts: true,
    telemetryRate: 1000,
    themeAccent: '#22D3EE',
  },

  updateSystemSettings: (settings) =>
    set((state) => ({
      systemSettings: { ...state.systemSettings, ...settings },
      toastMessage: 'System settings saved successfully!'
    })),

  // Diagnostics
  isDiagnosticRunning: false,
  diagnosticProgress: 0,

  runDiagnostics: (onComplete) => {
    if (get().isDiagnosticRunning) return;
    set({ isDiagnosticRunning: true, diagnosticProgress: 0 });

    let prog = 0;
    const timer = setInterval(() => {
      prog += 20;
      set({ diagnosticProgress: prog });
      if (prog >= 100) {
        clearInterval(timer);
        set({ isDiagnosticRunning: false, toastMessage: 'System Diagnostics Passed (100% Operational)' });
        if (onComplete) onComplete();
      }
    }, 400);
  },

  // Authentication
  isAuthenticated: false,
  userEmail: null,

  login: async (email: string) => {
    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      isAuthenticated: true,
      userEmail: email,
      toastMessage: `Welcome back, ${email.split('@')[0]}. Authenticated to MARIS Command Center.`
    });
    return true;
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userEmail: null,
      toastMessage: 'Signed out of MARIS session.'
    });
  },

  // Toast
  toastMessage: null,
  showToast: (msg) => set({ toastMessage: msg }),
  clearToast: () => set({ toastMessage: null }),
}));
