import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "NRP wajib diisi." })
    .max(50, { message: "NRP tidak boleh lebih dari 50 karakter." }),
  password: z
    .string()
    .min(1, { message: "Kata sandi wajib diisi." })
    .min(6, { message: "Kata sandi minimal 6 karakter." }) // Contoh: minimal 6 karakter
    .max(100, { message: "Kata sandi tidak boleh lebih dari 100 karakter." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
