import bcrypt from "bcrypt";
import { AppError } from "./error.utils.js";

export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10).catch((error) => {
        throw new AppError(`Gagal mengenkripsi password: ${error.message}`, 500);
    });

    return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword).catch((error) => {
        throw new AppError(`Password salah`, 500);
    });
};
