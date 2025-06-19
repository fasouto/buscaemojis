'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast, Toast } from '@/hooks/useToast';
import ToastContainer from './ToastContainer';

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], duration?: number) => string;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer 
        toasts={toastMethods.toasts} 
        removeToast={toastMethods.removeToast} 
      />
    </ToastContext.Provider>
  );
}