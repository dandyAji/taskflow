"use client";

import { useState, useMemo, useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useToast, ToastContainer } from "../ui/Toast";
import Sidebar from "../layout/Sidebar";
import TaskCard from "./TaskCard";
import TaskFilter from "./TaskFilter";
import TaskForm from "./TaskForm";
import TaskDeleteDialog from "./TaskDeleteDialog";
import Navbar from "../layout/Navbar";
import { TASK_STATUS } from "../../constants/task";
import Pagination from "../ui/Pagination";
import { useAuthStore } from "../../store/authStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";

export default function TasksClient() {
    const [statusFilter, setStatusFilter] = useState(TASK_STATUS.ALL);
    const [sortBy, setSortBy] = useState("newest");
    const [search, setSearch] = useState("");

    // Modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { tasks, loading, error, page, pagination, taskCounts, goToPage, createTask, updateTask, updateTaskStatus, deleteTask } = useTasks(statusFilter, search);
    const { toasts, showToast } = useToast();
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const storedUser = useAuthStore((s) => s.user);
    const [currentUser, setCurrentUser] = useState(storedUser);

    useEffect(() => {
        if (!currentUser) {
            authService
                .getMe()
                .then((data) => {
                    const user = data.user ?? data.data ?? data;
                    setCurrentUser(user);
                    useAuthStore.getState().setAuth(user, Cookies.get("token"));
                })
                .catch(() => {});
        }
    }, [currentUser]);

    const userName = currentUser?.name ?? "";
    const todayStr = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const activeCount = (taskCounts.pending ?? 0) + (taskCounts["in-progress"] ?? 0);

    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === "deadline") {
            result.sort((a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return a.deadline.localeCompare(b.deadline);
            });
        } else if (sortBy === "status") {
            const order = { pending: 0, "in-progress": 1, done: 2 };
            result.sort((a, b) => (order[a.status] ?? 0) - (order[b.status] ?? 0));
        }

        return result;
    }, [tasks, sortBy]);

    // Handlers
    const handleOpenCreate = () => {
        setEditingTask(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (task) => {
        setEditingTask(task);
        setFormOpen(true);
    };

    const handleSave = async (formData) => {
        setFormLoading(true);
        try {
            if (editingTask) {
                await updateTask(editingTask.id, formData);
                showToast("✓ Tugas berhasil diperbarui", "success");
            } else {
                await createTask(formData);
                showToast("✓ Tugas baru berhasil ditambahkan", "success");
            }
            setFormOpen(false);
            setEditingTask(null);
        } catch (err) {
            showToast(err.response?.data?.message || "Gagal menyimpan tugas", "error");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            await deleteTask(deletingTask.id);
            showToast("Tugas berhasil dihapus", "error");
            setDeletingTask(null);
        } catch (err) {
            showToast("Gagal menghapus tugas", "error");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <Navbar onSearch={setSearch} searchValue={search} onCreateTask={handleOpenCreate} />

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
                {/* Sidebar */}
                <Sidebar activeFilter={statusFilter} onFilter={setStatusFilter} taskCounts={taskCounts} onLogout={handleLogout} />

                {/* Main content */}
                <main className="flex-1 min-w-0">
                    {/* Greeting */}
                    <div className="mb-6 animate-fadeInUp">
                        <h2 className="font-display text-xl font-bold text-slate-900">Selamat datang, {userName || "..."} 👋</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {todayStr} · Kamu punya <span className="text-brand-500 font-medium">{activeCount} tugas</span> aktif
                        </p>
                    </div>

                    {/* Stats cards */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: "Total", value: taskCounts.all, color: "text-slate-900", bg: "bg-slate-500/10" },
                                { label: "Pending", value: taskCounts.pending, color: "text-amber-400", bg: "bg-amber-500/15" },
                                { label: "In Progress", value: taskCounts["in-progress"], color: "text-blue-400", bg: "bg-blue-500/15" },
                                { label: "Selesai", value: taskCounts.done, color: "text-emerald-400", bg: "bg-emerald-500/15" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-500 text-xs font-medium">{stat.label}</span>
                                        <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                            <div className={`w-2 h-2 rounded-full ${stat.color.replace("text-", "bg-")}`} />
                                        </div>
                                    </div>
                                    <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search mobile */}
                    <div className="sm:hidden mb-4">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari tugas..." className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                        </div>
                    </div>

                    {/* Filter + Sort */}
                    <TaskFilter activeFilter={statusFilter} onFilter={setStatusFilter} activeSort={sortBy} onSort={setSortBy} />

                    {/* Task list */}
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 h-20 animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-400 text-sm">{error}</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="font-display text-base font-bold text-slate-500 mb-1">Tidak ada tugas</h3>
                            <p className="text-slate-400 text-sm mb-5">{search ? "Tidak ada tugas yang cocok dengan pencarian" : "Mulai dengan menambahkan tugas pertama Anda"}</p>
                            {!search && (
                                <button onClick={handleOpenCreate} className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20">
                                    + Tambah Tugas
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((task, i) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={i}
                                    onEdit={handleOpenEdit}
                                    onDelete={setDeletingTask}
                                    onStatusChange={async (id, status) => {
                                        try {
                                            await updateTaskStatus(id, status);
                                            showToast("✓ Status diperbarui", "success");
                                        } catch {
                                            showToast("Gagal mengubah status", "error");
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile FAB */}
            <button onClick={handleOpenCreate} className="sm:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center transition-all active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Modals */}
            {formOpen && (
                <TaskForm
                    task={editingTask}
                    onSave={handleSave}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingTask(null);
                    }}
                    loading={formLoading}
                />
            )}

            {deletingTask && <TaskDeleteDialog task={deletingTask} onConfirm={handleDeleteConfirm} onClose={() => setDeletingTask(null)} loading={deleteLoading} />}

            {/* Pagination */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
                <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={goToPage} loading={loading} />
            </div>

            {/* Toast */}
            <ToastContainer toasts={toasts} />
        </>
    );
}
