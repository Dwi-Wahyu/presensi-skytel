"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, MailOpen, MoreHorizontal, SquarePen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDate, formatDateToYYYYMMDD } from "@/helper/date-helper";
import { PermissionColumnType } from "./tabel-permission";
import {
  permissionStatusMapping,
  permissionTypeMapping,
} from "@/constant/permission-mapping";
import { useState } from "react";
import { deletePermission } from "./actions";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export const TabelPermissionColumns: ColumnDef<PermissionColumnType>[] = [
  {
    accessorKey: "user.name",
    header: "Nama",
  },
  {
    header: "Jumlah Hari",
    cell: function Cell({ row }) {
      return <div>{row.original.days_count}</div>;
    },
  },
  {
    header: "Tanggal",
    cell: function Cell({ row }) {
      const formattedDateStart = formatDateToYYYYMMDD(row.original.date_start);
      const formattedDateEnd = formatDateToYYYYMMDD(row.original.date_end);

      if (formattedDateStart === formattedDateEnd) {
        return <div>{formattedDateStart}</div>;
      }

      return (
        <div>
          {formattedDateStart} sampai {formattedDateEnd}
        </div>
      );
    },
  },
  {
    header: "Jenis Izin",
    cell: function Cell({ row }) {
      return <div>{permissionTypeMapping[row.original.type]}</div>;
    },
  },
  {
    header: "Status Izin",
    cell: function Cell({ row }) {
      return <div>{permissionStatusMapping[row.original.status]}</div>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const { id } = row.original;

      const permission = row.original;
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const router = useRouter();

      const handleDeletePermission = async () => {
        setIsDeleting(true);

        try {
          const result = await deletePermission(permission.id);
          if (result.success) {
            toast.success(result.message || "Pengajuan izin berhasil dihapus!");
            router.refresh();
          } else {
            toast.error(
              result.error?.message || "Gagal menghapus permohonan izin."
            );
          }
        } catch (error) {
          console.error("Error deleting permission:", error);
          toast.error(
            "Terjadi kesalahan tak terduga saat menghapus permohonan izin."
          );
        } finally {
          setIsDeleting(false);
          setIsConfirmDialogOpen(false);
        }
      };

      return (
        <div>
          <Button asChild className="mr-2" variant={"outline"} size={"icon"}>
            <Link href={`/admin/pengajuan-izin/${id}`}>
              <MailOpen />
            </Link>
          </Button>

          <Button
            variant={"destructive"}
            onClick={() => setIsConfirmDialogOpen(true)}
            size={"icon"}
          >
            <Trash />
          </Button>

          <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeletePermission}
            title="Konfirmasi Penghapusan Izin"
            message={`Apakah Anda yakin ingin menghapus permohonan izin ini? Tindakan ini tidak dapat dibatalkan.`}
            confirmButtonText={isDeleting ? "Menghapus..." : "Hapus"}
            cancelButtonText="Batal"
            isLoading={isDeleting}
            confirmButtonVariant="destructive"
          />
        </div>
      );
    },
    size: 5,
  },
];
