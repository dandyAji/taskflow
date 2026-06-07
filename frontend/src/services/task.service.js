import api from "../lib/api";

export const taskService = {
    /**
     * GET /tasks?page=1&limit=10&status=pending
     */
    async getTasks({ page = 1, limit = 20, status = "", search = "" } = {}) {
        const params = { page: Number(page), limit: Number(limit), status: status || "all", search: search || "" };
        const res = await api.get("/tasks", { params });
        return res.data;
    },

    /**
     * GET /tasks/:id
     */
    async getTask(id) {
        const res = await api.get(`/tasks/${id}`);
        return res.data;
    },

    /**
     * POST /tasks
     */
    async createTask(data) {
        const res = await api.post("/tasks/", data);
        return res.data;
    },

    /**
     * PUT /tasks/:id
     */
    async updateTask(id, data) {
        const res = await api.put(`/tasks/${id}`, data);
        return res.data;
    },

    /**
     * PATCH /tasks/status/:id
     */
    async updateTaskStatus(id, status) {
        const res = await api.patch(`/tasks/status/${id}`, { status });
        return res.data;
    },

    /**
     * DELETE /tasks/:id
     */
    async deleteTask(id) {
        const res = await api.delete(`/tasks/${id}`);
        return res.data;
    },
};
