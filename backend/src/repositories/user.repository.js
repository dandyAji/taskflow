import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const createUser = async ({ name, email, password }) => {
    return prisma.user.create({
        data: { name, email, password },
    });
};

export const findByEmailAndPassword = async (email, password) => {
    return prisma.user.findFirst({
        where: { email, password },
    });
};

export const findById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
};
