"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { useAuthStore } from "../../../store/authStore";
import Logo from "../../../components/ui/Logo";

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Email dan password wajib diisi");
            return;
        }
        setLoading(true);
        try {
            const { token, user } = await authService.login(form.email, form.password);
            setAuth(user, token);
            router.push("/tasks");
        } catch (err) {
            setError(err.response?.data?.message || "Email atau password salah");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden flex-col justify-between p-12 border-r border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-white pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #C8102E 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="relative z-10">
                    <Logo />
                </div>
                <div className="relative z-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                            <span className="text-brand-500 text-xs font-medium tracking-wide">Simple. Fast. Focused.</span>
                        </div>
                        <h1 className="font-display text-4xl xl:text-5xl font-bold text-slate-900 leading-tight">
                            Kelola tugas
                            <br />
                            dengan lebih
                            <br />
                            <span className="text-brand-400">terstruktur.</span>
                        </h1>
                        <p className="text-slate-500 text-base leading-relaxed max-w-sm">Pantau semua pekerjaan Anda dalam satu tempat. Prioritaskan, atur deadline, dan selesaikan lebih cepat.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[
                            { value: "98%", label: "Task completion" },
                            { value: "3x", label: "More productive" },
                            { value: "∞", label: "Free forever" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10 text-slate-400 text-xs">© 2026 TaskFlow. All rights reserved.</div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
                <div className="w-full max-w-sm animate-fadeInUp">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <Logo />
                    </div>

                    <div className="mb-8">
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-1.5">Selamat datang kembali</h2>
                        <p className="text-slate-500 text-sm">Masuk untuk melanjutkan pekerjaan Anda</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">{error}</div>}

                        <div>
                            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@contoh.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider">Password</label>
                            </div>
                            <div className="relative">
                                <input type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" />
                                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <EyeIcon open={showPw} />
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all duration-200">
                            {loading ? "Memproses..." : "Masuk ke Akun"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium ml-1 transition-colors">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

function EyeIcon({ open }) {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
            )}
        </svg>
    );
}
