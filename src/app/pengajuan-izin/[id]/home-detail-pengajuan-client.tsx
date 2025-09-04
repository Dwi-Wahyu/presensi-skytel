"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDateToYYYYMMDD } from "@/helper/date-helper";
import Link from "next/link";
import { IconDownload, IconMailCheck, IconMailX } from "@tabler/icons-react";
import { NavigationButton } from "@/app/_components/navigation-button";
import { Button } from "@/components/ui/button";
import {
  permissionStatusMapping,
  permissionTypeMapping,
} from "@/constant/permission-mapping";
import { Edit, Trash } from "lucide-react";
import { getPermissionById } from "@/app/admin/pengajuan-izin/queries";
import { useState } from "react";
import { deletePermission } from "@/app/admin/pengajuan-izin/actions";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useRouter } from "nextjs-toploader/app";

export function HomePermissionDetailPageClient({
  permission,
  user_id,
}: {
  permission: NonNullable<Awaited<ReturnType<typeof getPermissionById>>>;
  user_id: string;
}) {
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  const formattedDateStart = formatDateToYYYYMMDD(permission.date_start);
  const formattedDateEnd = formatDateToYYYYMMDD(permission.date_end);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const handleDeletePermission = async () => {
    setIsDeleting(true);

    try {
      const result = await deletePermission(permission.id);
      if (result.success) {
        toast.success(result.message || "Pengajuan berhasil dihapus!");
        setTimeout(() => {
          router.push("/pengajuan-izin");
        }, 2000);
      } else {
        toast.error(result.error?.message || "Gagal menghapus pengajuan.");
      }
    } catch (error) {
      console.error("Error deleting permission: ", error);
      toast.error("Terjadi kesalahan tak terduga saat menghapus pengajuan.");
    } finally {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-t from-primary to-background">
      <Card className="">
        <CardHeader>
          <CardTitle>Detail Pengajuan Izin</CardTitle>
          <CardDescription>
            Informasi lengkap pengajuan izin oleh {permission.user.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="">
            <h1 className="font-semibold">Alasan</h1>
            <h1 className="text-muted-foreground">{permission.reason}</h1>
          </div>

          <div className="">
            <div className="flex justify-between mb-1 items-center">
              <h1 className="font-semibold">Bukti</h1>

              {permission.proof && (
                <Link
                  passHref
                  href={ADMIN_URL + permission.proof}
                  target="_blank"
                >
                  <Button variant={"link"}>
                    <IconDownload />
                    Download Bukti
                  </Button>
                </Link>
              )}
            </div>

            {permission.proof ? (
              <div className="flex justify-center">
                <img
                  src={ADMIN_URL + permission.proof}
                  alt=""
                  className="max-h-96"
                />
              </div>
            ) : (
              <div>tidak ada bukti</div>
            )}
          </div>

          <div className="">
            <h1 className="font-semibold">Jumlah Hari</h1>
            <h1 className="text-muted-foreground">{permission.days_count}</h1>
          </div>

          <div className="">
            <h1 className="font-semibold">Tanggal</h1>
            {formattedDateStart === formattedDateEnd ? (
              <h1 className="text-muted-foreground">{formattedDateStart}</h1>
            ) : (
              <h1 className="text-muted-foreground">
                {formattedDateStart} sampai {formattedDateEnd}
              </h1>
            )}
          </div>

          <div className="">
            <h1 className="font-semibold">Jenis Pengajuan</h1>
            <h1 className="text-muted-foreground">
              {permissionTypeMapping[permission.type]}
            </h1>
          </div>

          <div className="">
            <h1 className="font-semibold">Status Pengajuan</h1>
            <h1 className="text-muted-foreground">
              {permissionStatusMapping[permission.status]}
            </h1>
          </div>

          <div className="">
            <h1 className="font-semibold">Diajukan Pada</h1>
            <h1 className="text-muted-foreground">
              {formatDate(permission.created_at)}
            </h1>
          </div>

          <div className="flex justify-center mt-2 gap-4">
            <NavigationButton url="/pengajuan-izin" size={"lg"} />

            <Link href={"/pengajuan-izin/edit/" + permission.id} passHref>
              <Button size={"lg"}>
                <Edit /> Edit
              </Button>
            </Link>

            <Button
              variant={"destructive"}
              onClick={() => setIsConfirmDialogOpen(true)}
              size={"lg"}
            >
              <Trash /> Hapus
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeletePermission}
        title="Konfirmasi Penghapusan Pengajuan"
        message="Apakah Anda yakin ingin menghapus pengajuan izin ini? Tindakan ini tidak dapat dibatalkan."
        confirmButtonText={isDeleting ? "Menghapus..." : "Hapus Pengajuan"}
        cancelButtonText="Batal"
        isLoading={isDeleting}
        confirmButtonVariant="destructive"
      />
    </div>
  );
}
