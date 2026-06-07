'use client';

import { useEffect } from 'react';

export default function TaskDeleteDialog({ task, onConfirm, onClose, loading }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4 bg-slate-900/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl animate-scaleIn">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 mb-2">Hapus Tugas?</h3>
          <p className="text-slate-500 text-sm mb-1">
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <p className="text-slate-400 text-xs line-clamp-1">"{task.title}"</p>
        </div>
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-medium py-2.5 rounded-xl transition-all bg-white"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
