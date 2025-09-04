import { z } from "zod";

export const AttendanceStatusEnum = z.enum(["ATTEND", "ABSENT", "EXCUSED"]);

export const UpdateAttendanceSchema = z.object({
  id: z.number().int(),
  clock_in_at: z.string().nullable(),
  clock_out_at: z.string().nullable(),
  overtime_hours: z.number().nullable(),
  status: AttendanceStatusEnum,
});

export type UpdateAttendanceSchemaType = z.infer<typeof UpdateAttendanceSchema>;
