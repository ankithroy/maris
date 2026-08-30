import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMarisStore } from './lib/store';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { SonarAnalysis } from './pages/SonarAnalysis';
import { Bathymetry } from './pages/Bathymetry';
import { LiveSurvey } from './pages/LiveSurvey';
import { Anomalies } from './pages/Anomalies';
import { Map } from './pages/Map';
import { Reports } from './pages/Reports';
import { Dataset } from './pages/Dataset';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

// Protected Route component ensuring unauthenticated users see the Login Page first
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useMarisStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public-only Route ensuring logged-in users are sent to the Dashboard
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useMarisStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Public Login Route (Default entry point) */}
        <Route 
          path="login" 
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } 
        />

        {/* Protected Command Center Application Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="sonar" element={<SonarAnalysis />} />
          <Route path="bathymetry" element={<Bathymetry />} />
          <Route path="live" element={<LiveSurvey />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="map" element={<Map />} />
          <Route path="reports" element={<Reports />} />
          <Route path="dataset" element={<Dataset />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback wildcard route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
