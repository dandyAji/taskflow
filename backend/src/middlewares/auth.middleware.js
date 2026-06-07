import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.utils.js";
import { findById } from "../repositories/user.repository.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        const headers = req.headers.authorization;

        // Cek header
        if (!headers || !headers.startsWith("Bearer ")) {
            throw new AppError("Anda harus login terlebih dahulu", 401);
        }

        const token = headers.split(" ")[1];

        // Verifikasi JWT Token
        const decode = jwt.verify(token, jwtSecret);

        // Cari user berdasarkan hasil decode ID
        const currentUser = await findById(decode.id).catch((error) => {
            throw new AppError("Gagal mencari user", 500);
        });

        if (!currentUser) {
            throw new AppError("User pemilik token ini sudah tidak ada", 404);
        }

        // Pasang data user ke objek request
        req.user = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
        };

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(new AppError("Token tidak valid", 401));
        }
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token sudah kedaluwarsa", 401));
        }

        next(error);
    }
};
