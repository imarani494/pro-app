import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Toast} from './Toast';

type ToastType = 'success' | 'error';
type ToastPosition = 'top' | 'bottom';

interface ToastContextValue {
  showToast: (
    msg: string,
    type?: ToastType,
    position?: ToastPosition,
    duration?: number,
  ) => void;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({children}: {children: ReactNode}) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
    position: 'top',
    duration: 3000,
  });

  // Use ref pattern to maintain stable function reference
  const contextRef = React.useRef({
    showToast: (
      message: string,
      type: ToastType = 'success',
      position: ToastPosition = 'top',
      duration: number = 3000,
    ) => {
      setToast({visible: true, message, type, position, duration});
    },
  });

  const hideToast = () => {
    setToast(prev => ({...prev, visible: false}));
  };

  return (
    <ToastContext.Provider value={contextRef.current}>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position={toast.position}
        duration={toast.duration}
        onDismiss={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
