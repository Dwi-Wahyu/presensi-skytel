"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { catatPresensi, TriggerAbsen } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { RefreshButton } from "../admin/qrcode/refresh-button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "nextjs-toploader/app";

export default function ScannerPage() {
  const router = useRouter();

  async function handleScan(qrId: string) {
    const attendance = await catatPresensi(qrId);

    if (attendance.success) {
      router.push("/presensi/sukses");
    } else {
      router.push("/presensi/gagal/" + attendance.error.message);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-t from-primary justify-center to-primary/50 flex flex-col w-full">
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
