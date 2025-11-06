import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import './App.css';

// Debug component
const DebugInfo = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log('Auth state changed:', { user, loading });
  }, [user, loading]);
  
  return null;
};

// Simple Test Component
const TestPage = ({ title }: { title: string }) => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      width: '100%'
    }}>
      <h1 style={{ 
        fontSize: '2em', 
        marginBottom: '20px',
        color: '#333'
      }}>
        {title}
      </h1>
      <p style={{ marginBottom: '10px' }}>This is a test route to check if routing is working.</p>
      <p style={{ marginBottom: '20px' }}>Check the browser console for debug information.</p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <a href="/" style={buttonStyle}>Home</a>
        <a href="/dashboard" style={buttonStyle}>Dashboard</a>
        <a href="/login" style={buttonStyle}>Login</a>
        <a href="/admin" style={buttonStyle}>Admin</a>
      </div>
    </div>
  </div>
);

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'background-color 0.2s',
  border: 'none',
  cursor: 'pointer'
};

function App() {
  console.log('App component rendering');
  
  useEffect(() => {
    console.log('App mounted');
    return () => console.log('App unmounting');
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <DebugInfo />
        <Toaster />
        <Routes>
          <Route path="/" element={<Navigate to="/test" replace />} />
          <Route path="/test" element={<TestPage title="Test Page" />} />
          <Route path="/dashboard" element={<TestPage title="Dashboard" />} />
          <Route path="/login" element={<TestPage title="Login Page" />} />
          <Route path="/signup" element={<TestPage title="Sign Up" />} />
          <Route path="/admin" element={<TestPage title="Admin Dashboard" />} />
          <Route path="/faculty" element={<TestPage title="Faculty Dashboard" />} />
          <Route path="/settings" element={<TestPage title="Settings" />} />
          <Route path="/profile" element={<TestPage title="Profile" />} />
          <Route path="*" element={<TestPage title="404 - Page Not Found" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
