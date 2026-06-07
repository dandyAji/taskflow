import { formatError } from "../utils/error.formatter.util.js";
import { AppError } from "../utils/error.utils.js";

describe("formatError", () => {
    it("memformat AppError (operational) dengan statusCode dan message yang benar", () => {
        const error = new AppError("Email sudah terdaftar", 409);

        const result = formatError(error);

        expect(result.statusCode).toBe(409);
        expect(result.body.message).toBe("Email sudah terdaftar");
        expect(result.body.errors).toEqual([]);
    });

    it("mengembalikan 500 untuk error yang tidak dikenal", () => {
        const error = new Error("Unexpected DB crash");

        const result = formatError(error);

        expect(result.statusCode).toBe(500);
        expect(result.body.message).toBe("Terjadi kesalahan pada server");
    });

    it("memformat Zod validation error (array errors) dengan benar", () => {
        const zodError = {
            errors: [
                { path: ["email"], message: "Format email tidak valid" },
                { path: ["password"], message: "Password minimal 6 karakter" },
            ],
        };

        const result = formatError(zodError);

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Validasi gagal");
        expect(result.body.errors).toHaveLength(2);
        expect(result.body.errors[0]).toEqual({
            field: "email",
            message: "Format email tidak valid",
        });
        expect(result.body.errors[1]).toEqual({
            field: "password",
            message: "Password minimal 6 karakter",
        });
    });

    it("memformat AppError 401 untuk unauthorized", () => {
        const error = new AppError("Email atau password salah", 401);

        const result = formatError(error);

        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Email atau password salah");
    });
});
