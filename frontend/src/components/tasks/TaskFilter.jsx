"use client";

import { TASK_STATUS, TASK_STATUS_LABELS, SORT_OPTIONS } from "../../constants/task";

const FILTER_BUTTONS = [TASK_STATUS.ALL, TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE];

export default function TaskFilter({ activeFilter, onFilter, activeSort, onSort }) {
    return (
        <div className="flex items-center gap-2 mb-5 flex-wrap animate-fadeInUp animate-delay-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                {FILTER_BUTTONS.map((status) => {
                    const isActive = activeFilter === status;
                    return (
                        <button key={status} onClick={() => onFilter(status)} className={`filter-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? "bg-brand-500 text-white" : "text-slate-500 hover:text-brand-600 hover:bg-brand-50"}`}>
                            {TASK_STATUS_LABELS[status]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
