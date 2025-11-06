import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast-provider';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Clear any existing content in the root element
document.getElementById('root')!.innerHTML = '';

const root = createRoot(document.getElementById('root')!);

// Wrap the app with all necessary providers in the correct order
const AppWithProviders = () => (
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <ThemeProvider defaultTheme="system" storageKey="exam-invigilation-ui-theme">
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  </StrictMode>
);

// Render the app
root.render(<AppWithProviders />);

// Log that the app has started
console.log('Application started successfully');
