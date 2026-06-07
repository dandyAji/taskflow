"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { useAuthStore } from "../../../store/authStore";
import Logo from "../../../components/ui/Logo";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
        if (!form.email) newErrors.email = "Email wajib diisi";
        if (!form.password || form.password.length < 8) newErrors.password = "Password minimal 8 karakter";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Password tidak cocok";
        return newErrors;
    };

    const passwordStrength = () => {
        const pw = form.password;
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const strengthColors = ["bg-slate-200", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400"];
    const strength = passwordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validate();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setLoading(true);
        try {
            await authService.register(form.name, form.email, form.password);
            router.push("/login");
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Registrasi gagal, coba lagi" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-sm animate-fadeInUp">
                <div className="flex items-center gap-2 mb-10">
                    <Logo />
                </div>

                <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-1.5">Buat akun baru</h2>
                    <p className="text-slate-500 text-sm">Gratis selamanya. Tidak perlu kartu kredit.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">{errors.general}</div>}

                    <div>
                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Nama Lengkap</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@contoh.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 karakter" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" />
                            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                        {/* Password strength */}
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strength >= i ? strengthColors[strength] : "bg-slate-200"}`} />
                            ))}
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Konfirmasi Password</label>
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Ulangi password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" />
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all duration-200">
                        {loading ? "Membuat akun..." : "Buat Akun Gratis"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium ml-1 transition-colors">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
