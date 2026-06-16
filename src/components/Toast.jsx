import React, { useEffect } from 'react';

/**
 * ToastItem represents a single notification card.
 */
function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-800',
      desc: 'text-emerald-600',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-800',
      desc: 'text-rose-600',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-sky-50 border-sky-100',
      text: 'text-sky-800',
      desc: 'text-sky-600',
      icon: (
        <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentConfig = typeConfig[toast.type] || typeConfig.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${currentConfig.bg} transition-all duration-300 transform translate-y-0 opacity-100 animate-bounce-subtle`}
      style={{ animationDuration: '0.5s' }}
    >
      <div className="flex-shrink-0 mt-0.5">
        {currentConfig.icon}
      </div>
      <div className="flex-grow">
        <h4 className={`text-sm font-semibold ${currentConfig.text}`}>{toast.message}</h4>
        {toast.description && (
          <p className={`text-xs mt-1 ${currentConfig.desc}`}>{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors ${currentConfig.text}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Toast container to overlay items in the top-right corner.
 */
export default function ToastContainer({ toasts = [], removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div className="flex flex-col gap-3 w-full pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
