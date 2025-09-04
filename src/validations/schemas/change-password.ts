import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Kata sandi saat ini harus diisi" }),
    new_password: z
      .string()
      .min(8, { message: "Kata sandi baru minimal 8 karakter" }),
    confirm_password: z
      .string()
      .min(1, { message: "Konfirmasi kata sandi harus diisi" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Kata sandi baru dan konfirmasi kata sandi tidak cocok",
    path: ["confirm_password"],
  });

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
