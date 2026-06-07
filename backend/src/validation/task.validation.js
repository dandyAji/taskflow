import z from "zod";

export const taskValidation = z.object({
    title: z.string().min(3, "Title minimal 3 karakter"),
    description: z.string().optional(),
    deadline: z.string().optional(),
    status: z.enum(["pending", "in_progress", "done"]).optional(),
});
