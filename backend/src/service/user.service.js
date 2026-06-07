import { findByEmail, findById } from "../repositories/user.repository.js";
import { AppError } from "../utils/error.utils.js";

export const existingEmail = async (email) => {
    const user = await findByEmail(email);
    if (user) {
        throw new AppError("Email sudah terdaftar", 409);
    }
};

export const getUserById = async (userId) => {
    return findById(userId);
};
