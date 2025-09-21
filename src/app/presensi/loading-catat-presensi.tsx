import { Card, CardContent } from "@/components/ui/card";
import { IconClipboardData, IconLoader } from "@tabler/icons-react";
import React from "react";

export default function LoadingCatatPresensi({
  children,
  success = false,
}: {
  children?: React.ReactNode;
  success?: boolean;
}) {
  return (
    <div className="w-full relative min-h-svh bg-gradient-to-t from-primary to-background text-primary-foreground p-6 md:p-10 flex flex-col justify-center">
      <div className="flex justify-center mb-10 x items-center w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          {success ? (
            <IconClipboardData width={100} height={100} />
          ) : (
            <IconLoader
              width={100}
              height={100}
              className="text-primary animate-spin"
            />
          )}
        </div>
      </div>
      <Card className="shadow-lg">
        <CardContent>
          <h1 className="text-lg mb-3 font-semibold text-center">
            Mohon Tunggu Sesaat
          </h1>

          <div className="flex flex-col gap-2 text-sm">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}
