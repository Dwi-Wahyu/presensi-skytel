import { z } from "zod";

export const InputPermissionSchema = z.object({
  reason: z.string().min(1, "Perihal harus diisi"),
  days_count: z.number().int().min(1, "Jumlah hari minimal 1"),
  proof: z.string().nullable().optional(),
  type: z.enum(["FULL", "EARLY_LEAVE", "LATE"]),
  user_id: z.string(),
  date_start: z.date(),
  date_end: z.date(),
});

export type InputPermissionSchemaType = z.infer<typeof InputPermissionSchema>;

export const UpdatePermissionSchema = z.object({
  id: z.number().int(),
  reason: z.string().min(1, "Perihal harus diisi").optional(),
  days_count: z.number().int().min(1, "Jumlah hari minimal 1").optional(),
  proof: z.string().nullable().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  type: z.enum(["FULL", "EARLY_LEAVE", "LATE"]).optional(),
  user_id: z.string().optional(),
  date_start: z.date().optional(),
  date_end: z.date().optional(),
});

export type UpdatePermissionSchemaType = z.infer<typeof UpdatePermissionSchema>;
