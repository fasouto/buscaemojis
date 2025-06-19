'use client';

import { useEffect, useState } from 'react';
import { Toast } from '@/hooks/useToast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastNotificationProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastNotification({ toast, onRemove }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(onRemove, 150); // Wait for animation
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ease-in-out";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
    }
  };

  const transformClass = isLeaving 
    ? 'translate-x-full opacity-0' 
    : isVisible 
      ? 'translate-x-0 opacity-100' 
      : 'translate-x-full opacity-0';

  return (
    <div 
      className={`${getStyles()} transform ${transformClass} max-w-sm`}
      role="alert"
    >
      {getIcon()}
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}