"use client";

import { useState, useEffect, useRef } from "react";

const INITIAL_FORM = { title: "", description: "", status: "pending", deadline: "" };

export default function TaskForm({ task, onSave, onClose, loading }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [titleError, setTitleError] = useState("");
    const titleRef = useRef(null);

    const isEdit = !!task;

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "pending",
                deadline: task.deadline || "",
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setTitleError("");
        setTimeout(() => titleRef.current?.focus(), 100);
    }, [task]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (e.target.name === "title") setTitleError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setTitleError("Judul tidak boleh kosong");
            return;
        }
        if (!form.deadline) {
            setTitleError("Deadline tidak boleh kosong");
            return;
        }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4 bg-slate-900/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-display text-base font-bold text-slate-900">{isEdit ? "Edit Tugas" : "Tugas Baru"}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {/* Title */}
                        {titleError && <p className="text-red-400 text-xs mt-1 text-center">{titleError}</p>}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                Judul <span className="text-red-400">*</span>
                            </label>
                            <input ref={titleRef} type="text" name="title" value={form.title} onChange={handleChange} placeholder="Masukkan judul tugas..." maxLength={100} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deskripsi</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Tambahkan deskripsi (opsional)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none" />
                        </div>

                        {/* Status + Deadline */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                <select name="status" value={form.status} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all">
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deadline</label>
                                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium py-2.5 rounded-xl transition-all bg-white hover:bg-slate-50">
                            Batal
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20">
                            {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Tugas"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
