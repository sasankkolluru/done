import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DataUpload from './pages/admin/DataUpload';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import Settings from './pages/settings/Settings';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/error/NotFoundPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

// Debug component to log auth state changes
const DebugInfo = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log('Auth state changed:', { user, loading });
  }, [user, loading]);
  
  return null;
};

function App() {
  console.log('App component rendering');
  
  useEffect(() => {
    console.log('App mounted');
    return () => console.log('App unmounting');
  }, []);

  return (
    <SocketProvider>
      <DebugInfo />
      <Toaster />
      <div className="app-container">
        <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }>
                <Route path="data-upload" element={<DataUpload />} />
              </Route>
              
              <Route path="/faculty" element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
      </SocketProvider>
  );
}

export default App;
