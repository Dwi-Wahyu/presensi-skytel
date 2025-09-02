import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconQrcodeOff, IconX } from "@tabler/icons-react";
import { Scan } from "lucide-react";
import Link from "next/link";

export function QrCodeNotFound() {
  return (
    <div className="w-full min-h-svh bg-destructive text-destructive-foreground p-6 md:p-10 flex flex-col justify-center">
      <Card className=" shadow-lg">
        <CardContent className="flex flex-col gap-5 justify-center">
          <h1 className="text-2xl font-semibold text-center">
            QR Code tidak valid
          </h1>

          <div className="flex justify-center items-center w-full ">
            <div className="p-5 bg-destructive rounded-full shadow-lg">
              <IconQrcodeOff
                width={100}
                height={100}
                className="text-destructive-foreground"
              />
            </div>
          </div>

          <h1 className="text-center">
            Mungkin Qr Code Telah Berganti, Tolong Refresh Halaman Admin
          </h1>

          <Button
            size={"lg"}
            asChild
            className="self-center"
            variant={"outline"}
          >
            <Link href={"/scanner"}>
              <Scan />
              Scan Ulang
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
