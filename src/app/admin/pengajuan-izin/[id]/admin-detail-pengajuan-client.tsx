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
import { getPermissionById } from "../queries";
import { approvePermission, rejectPermission } from "../actions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function PermissionDetailPageClient({
  permission,
  user_id,
}: {
  permission: NonNullable<Awaited<ReturnType<typeof getPermissionById>>>;
  user_id: string;
}) {
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  const [isLoading, setIsLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const formattedDateStart = formatDateToYYYYMMDD(permission.date_start);
  const formattedDateEnd = formatDateToYYYYMMDD(permission.date_end);

  const handleApprove = async () => {
    setIsLoading(true);

    const result = await approvePermission(permission.id, user_id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error?.message);
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    const result = await rejectPermission(
      permission.id,
      user_id,
      rejectionReason || "Tidak ada alasan."
    );
    if (result.success) {
      toast.success(result.message);
      setRejectionReason("");
    } else {
      toast.error(result.error?.message);
    }
    setIsRejectDialogOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="container ">
      <Card className="w-xl mx-auto">
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

          <div className="flex justify-center mt-2 gap-2">
            <NavigationButton url="/admin/pengajuan-izin" />

            <Button
              variant={"destructive"}
              onClick={() => setIsRejectDialogOpen(true)}
              disabled={isLoading || permission.status === "REJECTED"}
            >
              {isLoading ? <Loader className="animate-spin" /> : <IconMailX />}
              Tolak
            </Button>

            <Button
              onClick={handleApprove}
              disabled={isLoading || permission.status === "APPROVED"}
            >
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <IconMailCheck />
              )}
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Penolakan Terintegrasi */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
          <DialogHeader className="flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-secondary" />
            <DialogTitle className="text-xl font-bold mt-2">
              Konfirmasi Penolakan Izin
            </DialogTitle>
            <DialogDescription className="text-base text-center">
              Apakah Anda yakin ingin menolak permohonan izin ini? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <div className="">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Alasan Penolakan
            </label>
            <Textarea
              placeholder="Tulis alasan penolakan di sini..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleReject}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? <Loader className="animate-spin" /> : "Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
