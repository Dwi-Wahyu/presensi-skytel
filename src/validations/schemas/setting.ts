import z from "zod";

export const UpdateSettingSchema = z.object({
  MINIMUM_LATE_THRESHOLD: z.coerce.number().int().min(1, {
    message: "Tolong isi maksimum waktu keterlambatan",
  }),
  OVERTIME_THRESHOLD: z.coerce.number().int().min(1, {
    message: "Tolong isi minimum waktu lembur",
  }),
  CLOCK_IN_TIME: z.string().min(5, { error: "Waktu Clock In tidak Valid" }),
  CLOCK_OUT_TIME: z.string().min(5, { error: "Waktu Clock Out tidak Valid" }),
});

export type UpdateSettingSchemaType = z.infer<typeof UpdateSettingSchema>;
