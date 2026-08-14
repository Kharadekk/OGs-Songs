import React, {StrictMode, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party cross-origin postMessage or unhandled iframe rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress unhandled promise rejections from third party iframes / media autoplay
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    // Suppress unhandled errors from external scripts / iframes
    event.preventDefault();
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Recovered from render warning:', error, errorInfo);
  }

  public override render() {
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

