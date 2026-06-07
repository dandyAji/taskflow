"use client";

import StatusDropdown from "../ui/StatusDropdown";
import { getDeadlineInfo } from "../../lib/utils";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, index = 0 }) {
    console.log(task.deadline);
    const deadlineInfo = getDeadlineInfo(task.deadline);
    const isDone = task.status === "done";

    return (
        <div className="task-card group relative hover:z-10 bg-white border border-slate-200 hover:border-brand-200 rounded-2xl p-4 flex gap-3 animate-slideIn shadow-sm hover:shadow-md" style={{ animationDelay: `${index * 0.04}s` }}>
            {/* Done indicator */}
            <button onClick={() => onStatusChange(task.id, isDone ? "pending" : "done")} className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200" title={isDone ? "Tandai belum selesai" : "Tandai selesai"}>
                {isDone ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-brand-400 transition-colors duration-200" />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium leading-snug ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>{task.title}</h4>
                        {task.description && <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{task.description}</p>}
                    </div>

                    {/* Action buttons */}
                    <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-500 transition-colors" title="Edit tugas">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors" title="Hapus tugas">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <StatusDropdown status={task.status} onChange={(newStatus) => onStatusChange(task.id, newStatus)} />
                    {deadlineInfo && (
                        <span className={`flex items-center gap-1 text-xs ${deadlineInfo.colorClass}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {deadlineInfo.label}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
