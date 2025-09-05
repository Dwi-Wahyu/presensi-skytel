import { z } from "zod";

export const InputEmployeeSchema = z.object({
  username: z.string().min(1, "Tolong isi username"),
  password: z.string().min(5, "Password minimal 5 karakter"),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),

  avatar: z.string().nullable().optional(),
});

export type InputEmployeeSchemaType = z.infer<typeof InputEmployeeSchema>;

export const UpdateEmployeeSchema = z.object({
  id: z.string(),
  username: z.string().min(1, "Tolong isi username"),
  password: z.string().optional(),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  email: z.string().optional(),
  phone_number: z.string().optional(),

  avatar: z.string().nullable().optional(),
});

export type UpdateEmployeeSchemaType = z.infer<typeof UpdateEmployeeSchema>;
