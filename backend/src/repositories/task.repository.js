import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async ({ title, description, userId, deadline, status }) => {
    return prisma.task.create({
        data: { title, description, userId, deadline: new Date(deadline), status },
    });
};

export const getAllTasks = async (userId, { offset, limit, status, search }) => {
    return prisma.task.findMany({
        where: {
            userId,
            ...(status !== "all" && { status }),
            ...(search && {
                title: {
                    contains: search,
                },
            }),
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};

export const getTaskByUserId = async (userId) => {
    return prisma.task.findMany({
        where: { userId },
    });
};

export const getTaskById = async (id) => {
    return prisma.task.findUnique({
        where: { id },
    });
};

export const updateTask = async (id, data) => {
    data.deadline = new Date(data.deadline);
    return prisma.task.update({
        where: { id },
        data,
    });
};

export const updateTaskStatus = async (id, status) => {
    return prisma.task.update({
        where: { id },
        data: { status },
    });
};

export const deleteTask = async (id) => {
    return prisma.task.delete({
        where: { id },
    });
};

export const countTask = async (userId) => {
    return prisma.task.count({
        where: { userId },
    });
};

export const countFilteredTasks = async (userId, { status, search }) => {
    return prisma.task.count({
        where: {
            userId,
            ...(status !== "all" && { status }),
            ...(search && {
                title: {
                    contains: search,
                },
            }),
        },
    });
};
