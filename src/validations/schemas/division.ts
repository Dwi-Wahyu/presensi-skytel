import { z } from "zod";

export const InputDivisionSchema = z.object({
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  users: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  leader_id: z.string().optional(),
});

export type InputDivisionSchemaType = z.infer<typeof InputDivisionSchema>;

export const UpdateDivisionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  users: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  leader_id: z.string().optional(),
});

export type UpdateDivisionSchemaType = z.infer<typeof UpdateDivisionSchema>;
