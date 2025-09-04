import { isAfter, addMinutes, parse } from "date-fns";
import {
  getClockInTime,
  getClockOutTime,
  getMinimumLateThreshold,
  getOvertimeThreshold,
} from "@/app/admin/pengaturan/queries";

export async function getClockInStatus(clockIn: Date | null) {
  if (!clockIn) {
    return "-";
  }

  const clockInTime = await getClockInTime();
  const minimumLateThreshold = await getMinimumLateThreshold();

  if (!clockInTime?.value || !minimumLateThreshold?.value) {
    return "-";
  }

  const baseClockInTime = parse(clockInTime.value, "HH:mm", new Date());

  const lateThresholdTime = addMinutes(
    baseClockInTime,
    Number(minimumLateThreshold.value)
  );

  if (isAfter(clockIn, lateThresholdTime)) {
    return "Terlambat";
  }

  return "Tepat Waktu";
}

export async function getClockOutStatus(clockOut: Date | null) {
  if (!clockOut) {
    return "-";
  }

  const clockOutTime = await getClockOutTime();
  const overtimeThreshold = await getOvertimeThreshold();

  if (!clockOutTime?.value || !overtimeThreshold?.value) {
    return "-";
  }

  const baseClockOutTime = parse(clockOutTime.value, "HH:mm", new Date());

  const overtimeThresholdTime = addMinutes(
    baseClockOutTime,
    Number(overtimeThreshold.value)
  );

  if (isAfter(clockOut, overtimeThresholdTime)) {
    return "Lembur";
  }

  return "Tepat Waktu";
}
