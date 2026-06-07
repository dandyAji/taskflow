import { countTask, createTask, deleteTask, getAllTasks, getTaskById, getTaskByUserId, updateTask, updateTaskStatus, countFilteredTasks } from "../repositories/task.repository.js";
import { AppError } from "../utils/error.utils.js";

export const create = async ({ title, description, userId, deadline, status }) => {
    const task = await createTask({ title, description, userId, deadline, status }).catch((error) => {
        throw new AppError(`Gagal membuat task: ${error.message}`);
    });

    return task;
};

export const getAll = async (userId, { page = 1, limit = 5, status = "all", search = "" }) => {
    if (search) page = 1;

    const offset = (page - 1) * limit;
    const tasks = await getAllTasks(userId, { offset, limit, status, search }).catch((error) => {
        throw new AppError(`Gagal mengambil task: ${error.message}`);
    });

    return tasks;
};

export const countTasks = async (userId) => {
    const tasks = await countTask();
    return tasks;
};

export const getById = async (id, userId) => {
    await isTaskOwner(id, userId);

    const task = await getTaskById(id).catch((error) => {
        throw new AppError(`Gagal mengambil task: ${error.message}`);
    });

    if (!task) {
        throw new AppError("Task tidak ditemukan", 404);
    }

    return task;
};

export const update = async (id, userId, data) => {
    await isTaskOwner(id, userId);

    const task = await updateTask(id, data).catch((error) => {
        throw new AppError(`Gagal mengupdate task: ${error.message}`);
    });

    return task;
};

export const updateStatus = async (id, userId, status) => {
    await isTaskOwner(id, userId);

    const task = await updateTaskStatus(id, status).catch((error) => {
        throw new AppError(`Gagal mengupdate status task: ${error.message}`);
    });

    return task;
};

export const remove = async (id, userId) => {
    await isTaskOwner(id, userId);

    const task = await deleteTask(id).catch((error) => {
        throw new AppError(`Gagal menghapus task: ${error.message}`);
    });

    return task;
};

const isTaskOwner = async (id, userId) => {
    const task = await getTaskById(id, userId).catch((error) => {
        throw new AppError(`Gagal mengambil task: ${error.message}`);
    });

    if (!task) throw new AppError("Task tidak ditemukan", 404);
    if (task.userId !== userId) throw new AppError("Anda tidak memiliki akses ke task ini", 403);

    return task;
};

export const countTasksGroupByStatus = async (userId) => {
    const tasks = await getTaskByUserId(userId);

    const initialCounts = {
        all: tasks.length,
        todo: 0,
        in_progress: 0,
        done: 0,
        pending: 0,
    };

    const statusCounts = tasks.reduce((acc, task) => {
        const status = task.status;

        if (acc[status] !== undefined) {
            acc[status] += 1;
        }

        return acc;
    }, initialCounts);

    return statusCounts;
};

export const countFiltered = async (userId, { status, search }) => {
    return countFilteredTasks(userId, { status, search });
};
