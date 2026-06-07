"use client";

import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/task.service";

const LIMIT = 3;

export const toApiStatus = (status) => {
    if (status === "in-progress") return "in_progress";
    return status;
};

export const fromApiStatus = (status) => {
    if (status === "in_progress") return "in-progress";
    return status;
};

export function useTasks(statusFilter = "all", searchQuery = "") {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [taskCounts, setTaskCounts] = useState({ all: 0, pending: 0, "in-progress": 0, done: 0 });
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        limit: LIMIT,
    });

    const fetchTasks = useCallback(
        async (targetPage = 1) => {
            setLoading(true);
            setError(null);
            try {
                const data = await taskService.getTasks({
                    status: toApiStatus(statusFilter),
                    page: targetPage,
                    limit: LIMIT,
                    search: searchQuery,
                });

                const meta = data.meta ?? {};
                const tt = meta.totalTask ?? data.totalTask ?? {};

                const list = (data.data ?? data.tasks ?? []).map((t) => ({
                    ...t,
                    status: fromApiStatus(t.status),
                }));

                setTaskCounts({
                    all: Number(tt.all ?? 0),
                    pending: Number(tt.pending ?? tt.todo ?? 0),
                    "in-progress": Number(tt.in_progress ?? 0),
                    done: Number(tt.done ?? 0),
                });

                setTasks(list);
                setPagination({
                    totalPages: Number(meta.totalPage ?? meta.totalPages ?? data.totalPage ?? 1),
                    currentPage: targetPage,
                    limit: LIMIT,
                });
            } catch (err) {
                setError(err.response?.data?.message || "Gagal memuat tugas");
            } finally {
                setLoading(false);
            }
        },
        [statusFilter, searchQuery],
    );

    useEffect(() => {
        setPage(1);
        fetchTasks(1);
    }, [statusFilter, searchQuery]);

    const goToPage = (newPage) => {
        setPage(newPage);
        fetchTasks(newPage);
    };

    const createTask = async (formData) => {
        const payload = { ...formData, status: toApiStatus(formData.status) };
        const res = await taskService.createTask(payload);
        setPage(1);
        fetchTasks(1);
        return res;
    };

    const updateTask = async (id, formData) => {
        const payload = { ...formData, status: toApiStatus(formData.status) };
        const res = await taskService.updateTask(id, payload);
        fetchTasks(page);
        return res;
    };

    const updateTaskStatus = async (id, status) => {
        const res = await taskService.updateTaskStatus(id, toApiStatus(status));
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
        fetchTasks(page);
        return res;
    };

    const deleteTask = async (id) => {
        const remaining = tasks.length - 1;
        const targetPage = remaining === 0 && page > 1 ? page - 1 : page;
        await taskService.deleteTask(id);
        setPage(targetPage);
        fetchTasks(targetPage);
    };

    return {
        tasks,
        loading,
        error,
        page,
        pagination,
        taskCounts,
        goToPage,
        refetch: () => fetchTasks(page),
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
    };
}
