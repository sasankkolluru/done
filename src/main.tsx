import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
import { ThemeProvider } from '@/contexts/ThemeContext';
=======
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
>>>>>>> 7dbaff3 (Resolve merge conflicts)
import { ToastProvider } from '@/components/ui/toast-provider';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

console.log('Application starting...');

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ErrorBoundary>
<<<<<<< HEAD
      <ThemeProvider defaultTheme="system" storageKey="exam-invigilation-ui-theme">
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
=======
      <Router>
        <ThemeProvider defaultTheme="system" storageKey="exam-invigilation-ui-theme">
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    </ErrorBoundary>
  </StrictMode>
);
