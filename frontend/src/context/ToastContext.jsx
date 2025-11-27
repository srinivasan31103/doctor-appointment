import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: <CheckCircle className="h-5 w-5" />,
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: <AlertCircle className="h-5 w-5" />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: <AlertTriangle className="h-5 w-5" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          icon: <Info className="h-5 w-5" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, warning, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className="pointer-events-auto animate-slideInRight"
              style={{
                animation: 'slideInRight 0.3s ease-out',
              }}
            >
              <div className={`${styles.bg} text-white rounded-lg shadow-2xl p-4 min-w-[300px] max-w-md flex items-start space-x-3`}>
                <div className="flex-shrink-0 mt-0.5">
                  {styles.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
