"use client";

import { useState, useRef, useEffect } from "react";

const OPTIONS = [
    {
        value: "pending",
        label: "Pending",
        className: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
        dotClass: "bg-amber-400",
        hoverClass: "hover:bg-amber-50",
        animate: false,
    },
    {
        value: "in-progress",
        label: "In Progress",
        className: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        dotClass: "bg-blue-400",
        hoverClass: "hover:bg-blue-50",
        animate: true,
    },
    {
        value: "done",
        label: "Done",
        className: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
        dotClass: "bg-emerald-400",
        hoverClass: "hover:bg-emerald-50",
        animate: false,
    },
];

export default function StatusDropdown({ status, onChange, disabled }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = OPTIONS.find((o) => o.value === status) || OPTIONS[0];

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (value) => {
        setOpen(false);
        if (value !== status) onChange(value);
    };

    return (
        <div ref={ref} className="relative inline-block">
            {/* Badge trigger */}
            <button type="button" disabled={disabled} onClick={() => setOpen((v) => !v)} className={`status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer select-none transition-all ${current.className} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 active:scale-95"}`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${current.dotClass} ${current.animate ? "animate-pulse" : ""}`} />
                {current.label}
                <svg className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 top-full mt-1.5 z-[200] bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-300/40 py-1 min-w-[130px] animate-scaleIn">
                    {OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" onClick={() => handleSelect(opt.value)} className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${opt.hoverClass} ${opt.value === status ? "opacity-50 cursor-default" : "cursor-pointer"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${opt.dotClass} ${opt.animate ? "animate-pulse" : ""}`} />
                            <span className={opt.value === status ? "text-slate-400" : "text-slate-700"}>{opt.label}</span>
                            {opt.value === status && (
                                <svg className="w-3 h-3 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
