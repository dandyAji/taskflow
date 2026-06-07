import { create, remove, getAll, getById, update, updateStatus, countTasks, countTasksGroupByStatus } from "../service/task.service.js";
import { formatError } from "../utils/error.formatter.util.js";
import { taskValidation } from "../validation/task.validation.js";

export const CreateTask = async (req, res) => {
    try {
        const data = taskValidation.parse(req.body);
        data.userId = req.user.id;
        const task = await create(data);

        res.status(201).json({
            message: "Berhasil menambahkan tugas",
            data: task,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

export const GetTasks = async (req, res) => {
    try {
        const { page, limit, status, search } = req.query;
        const parsedPage = Number(page ?? 1);
        const parsedLimit = Number(limit ?? 5);
        const parsedStatus = status ?? "all";
        const parsedSearch = search ?? "";

        const tasks = await getAll(req.user.id, {
            page: parsedPage,
            limit: parsedLimit,
            status: parsedStatus,
            search: parsedSearch,
        });

        const totalTask = await countTasksGroupByStatus(req.user.id);

        res.status(200).json({
            message: "Berhasil mendapatkan tugas",
            data: tasks,
            meta: {
                limit: parsedLimit ?? 5,
                page: parsedPage ?? 1,
                totalPage: Math.ceil(totalTask.all / (parsedLimit ?? 5)),
                totalTask: totalTask,
            },
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

export const GetTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const task = await getById(taskId, userId);

        res.status(200).json({
            message: "Berhasil mendapatkan tugas",
            data: task,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

export const UpdateTask = async (req, res) => {
    try {
        const data = taskValidation.parse(req.body);
        const taskId = req.params.id;
        const userId = req.user.id;
        const task = await update(taskId, userId, data);

        res.status(200).json({
            message: "Berhasil memperbarui tugas",
            data: task,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

export const UpdateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const status = req.body.status;
        const userId = req.user.id;
        const task = await updateStatus(taskId, userId, status);

        res.status(200).json({
            message: "Berhasil memperbarui status tugas",
            data: task,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

export const DeleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const task = await remove(taskId, userId);

        res.status(200).json({
            message: "Berhasil menghapus tugas",
            data: null,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};
