"use client";

import { TASK_STATUS, TASK_STATUS_LABELS } from "../../constants/task";

const sidebarItems = [
    {
        key: TASK_STATUS.ALL,
        label: "Semua Tugas",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
    },
    {
        key: TASK_STATUS.PENDING,
        label: "Pending",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        key: TASK_STATUS.IN_PROGRESS,
        label: "In Progress",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        key: TASK_STATUS.DONE,
        label: "Selesai",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

export default function Sidebar({ activeFilter, onFilter, taskCounts = {}, onLogout }) {
    return (
        <aside className="hidden lg:flex flex-col w-52 shrink-0 gap-1">
            <div className="mb-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-3 mb-2">Filter</p>
                {sidebarItems.map((item) => {
                    const isActive = activeFilter === item.key;
                    return (
                        <button key={item.key} onClick={() => onFilter(item.key)} className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-1 first:mt-0 ${isActive ? "bg-brand-500/10 text-brand-500" : "text-slate-500 hover:text-brand-600 hover:bg-brand-50"}`}>
                            {item.icon}
                            {item.label}
                            {taskCounts[item.key] !== undefined && <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-md ${isActive ? "bg-brand-500/20 text-brand-500" : "bg-slate-200/60 text-slate-400"}`}>{taskCounts[item.key]}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Pemisah + Keluar */}
            <div className="mt-2 pt-2 border-t border-slate-200">
                <button onClick={onLogout} className="sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Keluar
                </button>
            </div>
        </aside>
    );
}
