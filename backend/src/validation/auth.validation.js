import { z } from "zod";

export const registerValidation = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginValidation = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});
