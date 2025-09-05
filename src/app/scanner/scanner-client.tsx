"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { RefreshButton } from "../admin/qrcode/refresh-button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "nextjs-toploader/app";
import { catatPresensi } from "../presensi/catat/actions";
import { useState } from "react";
import { NotificationDialog } from "@/components/notification-dialog";

export default function ScannerPageClient({ user_id }: { user_id: string }) {
  const router = useRouter();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Terjadi kesalahan saat mencatat presensi. Silakan coba lagi."
  );

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  async function handleScan(scanResult: string) {
    if (scanResult !== ADMIN_URL + "/presensi/catat") {
      setErrorMessage("QR Code Tidak Valid");
      setIsErrorOpen(true);
      return;
    }

    const catat = await catatPresensi(user_id);

    if (!catat.success) {
      setErrorMessage(catat.error.message);
      setIsErrorOpen(true);
      return;
    }

    if (!catat.data) {
      setErrorMessage("Data presensi tidak ditemukan");
      setIsErrorOpen(true);
      return;
    }

    router.push("/presensi/sukses");
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-t from-primary justify-center to-primary/50 flex flex-col w-full">
      <NotificationDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Gagal mencatat presensi"
        message={errorMessage}
        variant="error"
      />

      <Card>
        <CardContent>
          <div className="mb-5 flex justify-between items-center">
            <Button asChild variant={"outline"} size={"lg"}>
              <Link href={"/home"}>
                <IconChevronLeft />
              </Link>
            </Button>

            <RefreshButton />
          </div>

          <Scanner onScan={(result) => handleScan(result[0].rawValue)} />

          <div className="mt-5 flex items-center flex-col">
            <h1 className="font-semibold text-lg">Scan QR Code</h1>
            <h1 className="text-muted-foreground">Izinkan Penggunaan Kamera</h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
