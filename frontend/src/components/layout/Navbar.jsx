"use client";

import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";
import { getInitials } from "../../lib/utils";
import Logo from "../ui/Logo";

export default function Navbar({ onSearch, searchValue = "", onCreateTask }) {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        useAuthStore.getState().logout();
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 gap-4">
                    {/* Logo */}
                    <div className="shrink-0">
                        <Logo />
                    </div>

                    {/* Search bar (desktop) */}
                    {onSearch && (
                        <div className="hidden sm:flex flex-1 max-w-sm mx-4 relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text" value={searchValue} onChange={(e) => onSearch(e.target.value)} placeholder="Cari judul tugas..." className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                        </div>
                    )}

                    {/* Right actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Tombol Tugas Baru (desktop) */}
                        {onCreateTask && (
                            <button onClick={onCreateTask} className="hidden sm:flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Tugas Baru
                            </button>
                        )}

                        {/* Avatar */}
                        <div className="hidden sm:flex w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 items-center justify-center text-xs font-bold text-white shrink-0">{getInitials(user?.name) || "U"}</div>

                        {/* Logout (mobile) */}
                        <button onClick={handleLogout} title="Keluar" className="lg:hidden p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
