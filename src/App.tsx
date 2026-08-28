import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { SonarAnalysis } from './pages/SonarAnalysis';
import { LiveSurvey } from './pages/LiveSurvey';
import { Anomalies } from './pages/Anomalies';
import { Map } from './pages/Map';
import { Reports } from './pages/Reports';
import { Dataset } from './pages/Dataset';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sonar" element={<SonarAnalysis />} />
          <Route path="live" element={<LiveSurvey />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="map" element={<Map />} />
          <Route path="reports" element={<Reports />} />
          <Route path="dataset" element={<Dataset />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
