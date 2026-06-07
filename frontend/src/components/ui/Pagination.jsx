"use client";

export default function Pagination({ currentPage, totalPages, onPageChange, loading }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            pages.push(i);
        } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
            pages.push("...");
        }
    }

    // Hapus duplikat '...'
    const deduplicated = pages.filter((p, i) => !(p === "..." && pages[i - 1] === "..."));

    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400">
                Halaman <span className="font-medium text-slate-600">{currentPage}</span> dari <span className="font-medium text-slate-600">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1">
                {/* Prev */}
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page numbers */}
                {deduplicated.map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-1 text-xs text-slate-400">
                            ···
                        </span>
                    ) : (
                        <button key={p} onClick={() => onPageChange(p)} disabled={loading} className={`min-w-[30px] h-[30px] rounded-lg text-xs font-medium transition-all disabled:cursor-not-allowed ${p === currentPage ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30" : "border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
                            {p}
                        </button>
                    ),
                )}

                {/* Next */}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
