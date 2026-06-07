import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/task.repository.js", () => ({
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    getTaskByUserId: jest.fn(),
    updateTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    deleteTask: jest.fn(),
    countTask: jest.fn(),
}));

const { createTask, getAllTasks, getTaskById, getTaskByUserId, updateTask, updateTaskStatus, deleteTask } = await import("../repositories/task.repository.js");

const { create, getAll, getById, update, updateStatus, remove, countTasksGroupByStatus } = await import("../service/task.service.js");

const MOCK_TASK = {
    id: "task-abc",
    title: "Test Task",
    description: "Deskripsi",
    status: "pending",
    userId: "user-123",
    deadline: new Date("2026-12-31"),
    createdAt: new Date(),
    updatedAt: new Date(),
};

// create
describe("taskService.create", () => {
    beforeEach(() => jest.clearAllMocks());

    it("berhasil membuat task baru", async () => {
        createTask.mockResolvedValue(MOCK_TASK);

        const result = await create({
            title: "Test Task",
            description: "Deskripsi",
            userId: "user-123",
            deadline: "2026-12-31",
            status: "pending",
        });

        expect(result).toEqual(MOCK_TASK);
        expect(createTask).toHaveBeenCalledTimes(1);
    });
});

// getAll - filter status
describe("taskService.getAll - filter status", () => {
    beforeEach(() => jest.clearAllMocks());

    it("memanggil getAllTasks dengan status 'pending'", async () => {
        getAllTasks.mockResolvedValue([MOCK_TASK]);

        const result = await getAll("user-123", { page: 1, limit: 5, status: "pending", search: "" });

        expect(getAllTasks).toHaveBeenCalledWith("user-123", expect.objectContaining({ status: "pending" }));
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("pending");
    });

    it("memanggil getAllTasks dengan status 'all'", async () => {
        getAllTasks.mockResolvedValue([MOCK_TASK, { ...MOCK_TASK, id: "task-xyz", status: "done" }]);

        const result = await getAll("user-123", { page: 1, limit: 5, status: "all", search: "" });

        expect(getAllTasks).toHaveBeenCalledWith("user-123", expect.objectContaining({ status: "all" }));
        expect(result).toHaveLength(2);
    });
});

// getAll - search keyword
describe("taskService.getAll - search keyword", () => {
    beforeEach(() => jest.clearAllMocks());

    it("memanggil getAllTasks dengan keyword dan reset ke page 1", async () => {
        getAllTasks.mockResolvedValue([MOCK_TASK]);

        await getAll("user-123", { page: 3, limit: 5, status: "all", search: "Test" });

        expect(getAllTasks).toHaveBeenCalledWith("user-123", expect.objectContaining({ search: "Test", offset: 0 }));
    });

    it("mengembalikan array kosong jika tidak ada task yang cocok", async () => {
        getAllTasks.mockResolvedValue([]);

        const result = await getAll("user-123", { page: 1, limit: 5, status: "all", search: "tidakada" });

        expect(result).toEqual([]);
    });
});

// getAll - pagination
describe("taskService.getAll - pagination", () => {
    beforeEach(() => jest.clearAllMocks());

    it("menghitung offset benar untuk page 2 limit 5 (offset = 5)", async () => {
        getAllTasks.mockResolvedValue([]);

        await getAll("user-123", { page: 2, limit: 5, status: "all", search: "" });

        expect(getAllTasks).toHaveBeenCalledWith("user-123", expect.objectContaining({ offset: 5, limit: 5 }));
    });

    it("menghitung offset benar untuk page 3 limit 10 (offset = 20)", async () => {
        getAllTasks.mockResolvedValue([]);

        await getAll("user-123", { page: 3, limit: 10, status: "all", search: "" });

        expect(getAllTasks).toHaveBeenCalledWith("user-123", expect.objectContaining({ offset: 20, limit: 10 }));
    });
});

// getById
describe("taskService.getById", () => {
    beforeEach(() => jest.clearAllMocks());

    it("berhasil mengambil task milik user", async () => {
        getTaskById.mockResolvedValue(MOCK_TASK);

        const result = await getById("task-abc", "user-123");

        expect(result).toEqual(MOCK_TASK);
    });

    it("melempar error 404 jika task tidak ditemukan", async () => {
        getTaskById.mockResolvedValue(null);

        await expect(getById("task-notexist", "user-123")).rejects.toMatchObject({ statusCode: 404 });
    });

    it("melempar error 403 jika task bukan milik user", async () => {
        getTaskById.mockResolvedValue({ ...MOCK_TASK, userId: "other-user" });

        await expect(getById("task-abc", "user-123")).rejects.toMatchObject({ statusCode: 403 });
    });
});

// update - sukses
describe("taskService.update - sukses", () => {
    beforeEach(() => jest.clearAllMocks());

    it("berhasil mengupdate task milik user", async () => {
        const updatedTask = { ...MOCK_TASK, title: "Judul Baru", description: "Deskripsi baru" };
        getTaskById.mockResolvedValue(MOCK_TASK);
        updateTask.mockResolvedValue(updatedTask);

        const result = await update("task-abc", "user-123", {
            title: "Judul Baru",
            description: "Deskripsi baru",
            status: "pending",
            deadline: "2026-12-31",
        });

        expect(updateTask).toHaveBeenCalledWith("task-abc", expect.objectContaining({ title: "Judul Baru" }));
        expect(result.title).toBe("Judul Baru");
        expect(result.description).toBe("Deskripsi baru");
    });
});

// update - forbidden & not found
describe("taskService.update - forbidden & not found", () => {
    beforeEach(() => jest.clearAllMocks());

    it("melempar error 403 jika task bukan milik user, updateTask tidak dipanggil", async () => {
        getTaskById.mockResolvedValue({ ...MOCK_TASK, userId: "other-user-999" });

        await expect(update("task-abc", "user-123", { title: "Coba", status: "pending", deadline: "2026-12-31" })).rejects.toMatchObject({
            statusCode: 403,
            message: "Anda tidak memiliki akses ke task ini",
        });

        expect(updateTask).not.toHaveBeenCalled();
    });

    it("melempar error 404 jika task tidak ditemukan saat update", async () => {
        getTaskById.mockResolvedValue(null);

        await expect(update("task-notexist", "user-123", { title: "X", status: "pending", deadline: "2026-12-31" })).rejects.toMatchObject({ statusCode: 404 });

        expect(updateTask).not.toHaveBeenCalled();
    });
});

// updateStatus
describe("taskService.updateStatus", () => {
    beforeEach(() => jest.clearAllMocks());

    it("berhasil mengupdate status task", async () => {
        getTaskById.mockResolvedValue(MOCK_TASK);
        updateTaskStatus.mockResolvedValue({ ...MOCK_TASK, status: "done" });

        const result = await updateStatus("task-abc", "user-123", "done");

        expect(result.status).toBe("done");
        expect(updateTaskStatus).toHaveBeenCalledWith("task-abc", "done");
    });
});

// remove
describe("taskService.remove", () => {
    beforeEach(() => jest.clearAllMocks());

    it("berhasil menghapus task milik user", async () => {
        getTaskById.mockResolvedValue(MOCK_TASK);
        deleteTask.mockResolvedValue(MOCK_TASK);

        const result = await remove("task-abc", "user-123");

        expect(deleteTask).toHaveBeenCalledWith("task-abc");
        expect(result).toEqual(MOCK_TASK);
    });
});

// countTasksGroupByStatus
describe("taskService.countTasksGroupByStatus", () => {
    beforeEach(() => jest.clearAllMocks());

    it("menghitung jumlah task per status dengan benar", async () => {
        getTaskByUserId.mockResolvedValue([{ status: "pending" }, { status: "pending" }, { status: "in_progress" }, { status: "done" }]);

        const result = await countTasksGroupByStatus("user-123");

        expect(result.all).toBe(4);
        expect(result.pending).toBe(2);
        expect(result.in_progress).toBe(1);
        expect(result.done).toBe(1);
    });
});
