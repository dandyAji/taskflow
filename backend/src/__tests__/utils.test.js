import { jest } from "@jest/globals";

// AppError (error.utils.js)
import { AppError } from "../utils/error.utils.js";

describe("AppError", () => {
    it("membuat error dengan message dan statusCode yang benar", () => {
        const error = new AppError("Tidak ditemukan", 404);

        expect(error.message).toBe("Tidak ditemukan");
        expect(error.statusCode).toBe(404);
    });

    it("memiliki flag isOperational = true", () => {
        const error = new AppError("Server error", 500);

        expect(error.isOperational).toBe(true);
    });

    it("merupakan instance dari Error", () => {
        const error = new AppError("Unauthorized", 401);

        expect(error).toBeInstanceOf(Error);
    });

    it("memiliki stack trace", () => {
        const error = new AppError("Test error", 400);

        expect(error.stack).toBeDefined();
    });
});

// formatError (error.formatter.util.js)
import { formatError } from "../utils/error.formatter.util.js";

describe("formatError", () => {
    it("memformat AppError (operational) dengan statusCode dan message yang benar", () => {
        const error = new AppError("Email sudah terdaftar", 409);

        const result = formatError(error);

        expect(result.statusCode).toBe(409);
        expect(result.body.message).toBe("Email sudah terdaftar");
        expect(result.body.errors).toEqual([]);
    });

    it("mengembalikan 500 untuk error non-operational (Error biasa)", () => {
        const error = new Error("Unexpected DB crash");

        const result = formatError(error);

        expect(result.statusCode).toBe(500);
        expect(result.body.message).toBe("Terjadi kesalahan pada server");
    });

    it("memformat Zod validation error (Array errors) dengan benar", () => {
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
        expect(result.body.errors[0]).toEqual({ field: "email", message: "Format email tidak valid" });
        expect(result.body.errors[1]).toEqual({ field: "password", message: "Password minimal 6 karakter" });
    });

    it("memformat Zod error dengan path kosong menggunakan field 'unknown'", () => {
        const zodError = {
            errors: [{ path: [], message: "Field tidak valid" }],
        };

        const result = formatError(zodError);

        expect(result.body.errors[0].field).toBe("unknown");
    });

    it("memformat AppError 401 untuk unauthorized", () => {
        const error = new AppError("Email atau password salah", 401);

        const result = formatError(error);

        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Email atau password salah");
    });

    it("memformat AppError 403 untuk forbidden", () => {
        const error = new AppError("Anda tidak memiliki akses", 403);

        const result = formatError(error);

        expect(result.statusCode).toBe(403);
        expect(result.body.message).toBe("Anda tidak memiliki akses");
        expect(result.body.errors).toEqual([]);
    });

    it("memformat AppError 404 untuk not found", () => {
        const error = new AppError("Data tidak ditemukan", 404);

        const result = formatError(error);

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Data tidak ditemukan");
    });
});

// bcrypt.util.js
jest.unstable_mockModule("bcrypt", () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn(),
    },
}));

const bcrypt = (await import("bcrypt")).default;
const { hashPassword, comparePassword } = await import("../utils/bcrypt.util.js");

describe("hashPassword", () => {
    beforeEach(() => jest.clearAllMocks());

    it("berhasil mengembalikan hashed password", async () => {
        bcrypt.hash.mockResolvedValue("hashed_password_123");

        const result = await hashPassword("mypassword");

        expect(result).toBe("hashed_password_123");
        expect(bcrypt.hash).toHaveBeenCalledWith("mypassword", 10);
    });

    it("melempar AppError jika bcrypt.hash gagal", async () => {
        bcrypt.hash.mockRejectedValue(new Error("bcrypt failed"));

        await expect(hashPassword("mypassword")).rejects.toMatchObject({
            isOperational: true,
            statusCode: 500,
        });
    });
});

describe("comparePassword", () => {
    beforeEach(() => jest.clearAllMocks());

    it("mengembalikan true jika password cocok", async () => {
        bcrypt.compare.mockResolvedValue(true);

        const result = await comparePassword("mypassword", "hashed_password_123");

        expect(result).toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith("mypassword", "hashed_password_123");
    });

    it("mengembalikan false jika password tidak cocok", async () => {
        bcrypt.compare.mockResolvedValue(false);

        const result = await comparePassword("wrongpassword", "hashed_password_123");

        expect(result).toBe(false);
    });

    it("melempar AppError jika bcrypt.compare gagal", async () => {
        bcrypt.compare.mockRejectedValue(new Error("compare failed"));

        await expect(comparePassword("mypassword", "hashed")).rejects.toMatchObject({
            isOperational: true,
            statusCode: 500,
        });
    });
});

// jwt.util.js
jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
        sign: jest.fn(),
        verify: jest.fn(),
    },
}));

const jwt = (await import("jsonwebtoken")).default;
const { generateToken, verifyToken } = await import("../utils/jwt.util.js");

describe("generateToken", () => {
    beforeEach(() => jest.clearAllMocks());

    it("memanggil jwt.sign dan mengembalikan token dengan benar", () => {
        jwt.sign.mockReturnValue("mock_token_abc");

        const payload = { id: "user-123", email: "test@mail.com" };
        const token = generateToken(payload);

        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(token).toBe("mock_token_abc");
    });

    it("jwt.sign dipanggil dengan argument pertama berisi payload yang dikirim", () => {
        jwt.sign.mockReturnValue("mock_token_once");

        const payload = { id: "user-1" };
        generateToken(payload);

        const [calledPayload] = jwt.sign.mock.calls[0];
        expect(calledPayload).toEqual({ id: "user-1" });
    });

    it("jwt.sign dipanggil dengan options expiresIn", () => {
        jwt.sign.mockReturnValue("mock_token");

        generateToken({ id: "user-99" });

        const [, , calledOptions] = jwt.sign.mock.calls[0];
        expect(calledOptions).toHaveProperty("expiresIn");
    });
});

describe("verifyToken", () => {
    beforeEach(() => jest.clearAllMocks());

    it("mengembalikan decoded payload jika token valid", () => {
        const decoded = { id: "user-123", email: "test@mail.com" };
        jwt.verify.mockReturnValue(decoded);

        const result = verifyToken("valid_token");

        const [calledToken] = jwt.verify.mock.calls[0];
        expect(calledToken).toBe("valid_token");
        expect(result).toEqual(decoded);
    });

    it("melempar error jika token tidak valid", () => {
        jwt.verify.mockImplementation(() => {
            const err = new Error("invalid signature");
            err.name = "JsonWebTokenError";
            throw err;
        });

        expect(() => verifyToken("invalid_token")).toThrow("invalid signature");
    });

    it("melempar error jika token sudah kedaluwarsa", () => {
        jwt.verify.mockImplementation(() => {
            const err = new Error("jwt expired");
            err.name = "TokenExpiredError";
            throw err;
        });

        expect(() => verifyToken("expired_token")).toThrow("jwt expired");
    });
});
