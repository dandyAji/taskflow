'use client';

import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, showToast };
}

const TYPE_COLORS = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-brand-500',
};

export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-xl ${
            TYPE_COLORS[t.type] || TYPE_COLORS.success
          } pointer-events-auto`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
