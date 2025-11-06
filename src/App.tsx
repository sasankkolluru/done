import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
<<<<<<< HEAD
=======
import { SocketProvider } from '@/contexts/SocketContext';
>>>>>>> 7dbaff3 (Resolve merge conflicts)
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
    <AuthProvider>
<<<<<<< HEAD
      <BrowserRouter>
        <DebugInfo />
        <Toaster />
        <div className="app-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DataUpload />
              </ProtectedRoute>
            } />
            
            {/* Faculty Only Routes */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } />
            
            {/* Error Pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
=======
      <SocketProvider>
        <BrowserRouter>
          <DebugInfo />
          <Toaster />
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/upload" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DataUpload />
                </ProtectedRoute>
              } />
              
              {/* Faculty Only Routes */}
              <Route path="/faculty" element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } />
              
              {/* Error Pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
      </SocketProvider>
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    </AuthProvider>
  );
}

export default App;
