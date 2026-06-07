import { createUser, findByEmail } from "../repositories/user.repository.js";
import { AppError } from "../utils/error.utils.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.util.js";

const register = async ({ name, email, password }) => {
    const hashedPassword = await hashPassword(password).catch((error) => {
        throw new AppError(`Gagal mengenkripsi password: ${error.message}`, 500);
    });

    const user = await createUser({
        name,
        email,
        password: hashedPassword,
    }).catch((error) => {
        throw new AppError(`Gagal mendaftar user: ${error.message}`, 500);
    });

    return { id: user.id, name: user.name, email: user.email };
};

const login = async (email, password) => {
    const user = await findByEmail(email).catch((error) => {
        throw new AppError(`Gagal mencari user: ${error.message}`, 500);
    });

    if (!user) {
        throw new AppError("Email atau password salah", 401);
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError("Email atau password salah", 401);
    }

    return { id: user.id, name: user.name, email: user.email };
};

export default { register, login };
