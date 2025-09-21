import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconClipboardData, IconHome, IconX } from "@tabler/icons-react";
import { MapPinOff } from "lucide-react";
import Link from "next/link";

export default async function LocationNotSupportedPage() {
  return (
    <div className="w-full relative min-h-svh bg-destructive p-6 md:p-10 flex flex-col justify-center">
      <Card className=" shadow-lg">
        <CardContent className="flex flex-col justify-center">
          <h1 className="text-xl mb-1 font-semibold text-center">
            Terjadi Kesalahan
          </h1>
          <h1 className="text-center text-muted-foreground text-sm">
            Pembacaan Lokasi Tidak Didukung Oleh Perangkat Anda, Silakan Hubungi
            Administrator atau Coba Izinkan Penggunaan Lokasi
          </h1>

          <div className="flex justify-center items-center w-full mt-5 mb-6">
            <div className="p-5 bg-destructive rounded-full shadow-lg">
              <MapPinOff
                width={100}
                height={100}
                className="text-destructive-foreground"
              />
            </div>
          </div>

          <Button variant={"outline"} size={"lg"} className="w-fit self-center">
            <Link href={"/home"}>Kembali Ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
