import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Scan } from "lucide-react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { RefreshButton } from "./refresh-button";
import { IconScan } from "@tabler/icons-react";

export default async function QrcodePage() {
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  let qrCodeId;

  const findExistingId = await prisma.validQRCode.findFirst();

  if (!findExistingId) {
    const createQRCodeInDb = await prisma.validQRCode.create({
      data: {
        id: uuidv4(),
      },
    });

    qrCodeId = createQRCodeInDb.id;
  } else {
    qrCodeId = findExistingId.id;
  }

  return (
    <div className="container">
      <Card className="mx-auto w-fit">
        <CardContent className="flex flex-col px-10 justify-center items-center">
          <div className="mb-5 inline-flex items-center gap-2">
            <IconScan />
            <h1 className="text-xl font-bold">Scan QR Code</h1>
          </div>

          <QRCode value={qrCodeId} size={300} />

          <div className="mt-6">
            <RefreshButton buttonText="Refresh QR Code" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
