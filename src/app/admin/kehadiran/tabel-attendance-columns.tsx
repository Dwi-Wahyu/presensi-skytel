"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceColumnType } from "./tabel-attendance";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, SquarePen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDate } from "@/helper/date-helper";
import { attendanceStatusMapping } from "@/constant/attendance-status-mapping";
import { formatToHour } from "@/helper/hour-helper";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "sonner";
import { deleteAttendance } from "./actions";
import { useState } from "react";

export const TabelAttendanceColumns: ColumnDef<AttendanceColumnType>[] = [
  {
    accessorKey: "user.name",
    header: "Nama",
  },
  {
    header: "Tanggal",
    cell: function Cell({ row }) {
      const { date } = row.original;

      return <div>{formatDate(date)}</div>;
    },
  },
  {
    header: "Clock In",
    cell: function Cell({ row }) {
      return <div>{formatToHour(row.original.clock_in_at)}</div>;
    },
  },
  {
    header: "Clock Out",
    cell: function Cell({ row }) {
      return <div>{formatToHour(row.original.clock_out_at)}</div>;
    },
  },
  {
    header: "Status",
    cell: function Cell({ row }) {
      return <div>{attendanceStatusMapping[row.original.status]}</div>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const { id } = row.original;

      const attendance = row.original;
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDeleteAttendance = async () => {
        setIsDeleting(true);

        try {
          const result = await deleteAttendance(attendance.id);
          if (result.success) {
            toast.success(result.message || "Kehadiran berhasil dihapus!");
          } else {
            toast.error(result.error?.message || "Gagal menghapus kehadiran.");
          }
        } catch (error) {
          console.error("Error deleting kehadiran:", error);
          toast.error(
            "Terjadi kesalahan tak terduga saat menghapus kehadiran."
          );
        } finally {
          setIsDeleting(false);
          setIsConfirmDialogOpen(false);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/kehadiran/${id}`}>
                  <Eye className="mb-[1px] h-4 w-4" /> Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/kehadiran/edit/${id}`}>
                  <SquarePen className="mb-[1px] h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsConfirmDialogOpen(true)}>
                <Trash className="mb-[1px] h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteAttendance}
            title="Konfirmasi Penghapusan"
            message={`Apakah Anda yakin ingin menghapus kehadiran "${
              attendance.user.name
            }" pada tanggal ${formatDate(
              attendance.date
            )} ? Tindakan ini tidak dapat dibatalkan.`}
            confirmButtonText={isDeleting ? "Menghapus..." : "Hapus"}
            cancelButtonText="Batal"
            isLoading={isDeleting}
            confirmButtonVariant="destructive"
          />
        </>
      );
    },
    size: 5,
  },
];
