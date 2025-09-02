import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconHome, IconScan, IconX } from "@tabler/icons-react";
import Link from "next/link";

export default async function GagalPresensiPage({
  params,
}: {
  params: Promise<{ reason: string }>;
}) {
  const { reason } = await params;

  return (
    <div className="w-full relative min-h-svh bg-destructive p-6 md:p-10 flex flex-col justify-center">
      <div className="flex w-full justify-between absolute top-0 left-0 p-6">
        <Button variant={"outline"} size={"lg"}>
          <Link href={"/home"}>
            <IconHome />
          </Link>
        </Button>
        <Button asChild variant={"outline"} size={"lg"}>
          <Link href={"/scanner"}>
            <IconScan />
          </Link>
        </Button>
      </div>

      <Card className=" shadow-lg">
        <CardContent className="flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-center">
            Gagal Mencatat Presensi
          </h1>
          <h1 className="text-center">{reason}</h1>

          <div className="flex justify-center items-center w-full mt-4">
            <div className="p-5 bg-destructive rounded-full shadow-lg">
              <IconX
                width={100}
                height={100}
                className="text-destructive-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
