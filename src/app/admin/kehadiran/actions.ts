"use server";

import * as fs from "fs/promises";
import * as path from "path";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { attendanceStatusMapping } from "@/constant/attendance-status-mapping";
import { ServerActionReturn } from "@/types/server-action";
import { UpdateAttendanceSchemaType } from "@/validations/schemas/attendance";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { PrismaClientKnownRequestError } from "@/app/generated/prisma/runtime/library";
import { format, parse } from "date-fns";
import { formatToHour } from "@/helper/hour-helper";

export async function ExportAttendanceData(startTime: Date, endTime: Date) {
  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startTime,
          lte: endTime,
        },
      },
      select: {
        date: true,
        status: true,
        clock_in_at: true,
        clock_out_at: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedData = attendanceRecords.map((record) => ({
      Tanggal: record.date.toISOString().split("T")[0],
      "Nama Karyawan": record.user.name,
      Status: attendanceStatusMapping[record.status],
      "Clock In": record.clock_in_at ? formatToHour(record.clock_in_at) : "-",
      "Clock Out": record.clock_out_at
        ? formatToHour(record.clock_out_at)
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // 1. Tambahkan konfigurasi lebar kolom
    const wscols = [
      { wch: 15 }, // Kolom Tanggal (A)
      { wch: 25 }, // Kolom Nama Karyawan (B)
      { wch: 15 }, // Kolom Status (C)
      { wch: 15 }, // Kolom Clock In (D)
      { wch: 15 }, // Kolom Clock Out (E)
    ];
    worksheet["!cols"] = wscols;

    // 2. Logika untuk menggabungkan sel dan mengatur alignment
    const merges = [];
    if (formattedData.length > 0) {
      let startRow = 2; // Data dimulai dari baris ke-2 (setelah header)
      let endRow = 2;

      for (let i = 1; i <= formattedData.length; i++) {
        const currentDate = formattedData[i - 1].Tanggal;
        const nextDate = formattedData[i]?.Tanggal;

        if (currentDate === nextDate) {
          endRow++;
        } else {
          if (endRow > startRow) {
            merges.push({
              s: { r: startRow - 1, c: 0 },
              e: { r: endRow - 1, c: 0 },
            });
          }

          // Pastikan sel pertama dari setiap grup memiliki gaya
          const cell = worksheet[`A${startRow}`];
          if (cell) {
            if (!cell.s) cell.s = {};
            cell.s.alignment = { vertical: "middle", horizontal: "center" };
          }

          startRow = i + 2;
          endRow = i + 2;
        }
      }
    }

    if (merges.length > 0) {
      worksheet["!merges"] = merges;
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kehadiran");

    const uploadDir = path.join(process.cwd(), "public", "uploads", "laporan");
    const filename = `Laporan_Kehadiran_${
      startTime.toISOString().split("T")[0]
    }_${endTime.toISOString().split("T")[0]}.xlsx`;
    const filePath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });

    await fs.writeFile(
      filePath,
      XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
    );

    return {
      success: true,
      message: `Data berhasil diekspor ke ${filename}`,
      filePath: `/uploads/laporan/${filename}`,
    };
  } catch (error) {
    console.error("Gagal mengekspor data:", error);
    return { success: false, message: "Gagal mengekspor data." };
  }
}

export async function updateAttendance(
  payload: UpdateAttendanceSchemaType
): Promise<ServerActionReturn<void>> {
  const { id, clock_in_at, clock_out_at, ...data } = payload;

  try {
    const updated = await prisma.attendance.update({
      where: {
        id,
      },
      data: {
        clock_in_at: clock_in_at
          ? parse(clock_in_at, "HH:mm", new Date())
          : null,
        clock_out_at: clock_out_at
          ? parse(clock_out_at, "HH:mm", new Date())
          : null,
        ...data,
      },
    });

    console.log(updated);

    return successResponse(undefined, "Data Karyawan berhasil diperbarui");
  } catch (e: any) {
    console.error(e);

    return errorResponse(
      "Terjadi kesalahan saat memperbarui kehadiran",
      "SERVER_ERROR"
    );
  }
}
