import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { PermissionEditForm } from "./permission-edit-form";
import NotFoundResource from "@/app/_components/not-found-resource";
import { getPermissionById } from "@/app/admin/pengajuan-izin/queries";
import { Mail, MailCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationButton } from "@/app/_components/navigation-button";

export default async function PermissionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return <UnauthorizedPage />;
  }

  const { id } = await params;

  if (isNaN(parseInt(id))) {
    return <NotFoundResource />;
  }

  const permission = await getPermissionById(parseInt(id));

  if (!permission) {
    return <NotFoundResource />;
  }

  if (permission.status === "APPROVED") {
    return (
      <div className="w-full min-h-svh p-6 bg-gradient-to-t from-primary to-background flex flex-col justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 px-5">
            <h1 className="font-semibold text-center text-lg">
              Pengajuan Tidak Dapat Diubah
            </h1>

            <MailCheck width={100} height={100} className="text-primary" />

            <p className="text-center text-sm text-muted-foreground">
              Pengajuan Anda telah disetujui, sehingga perubahan tidak dapat
              dilakukan. Silakan periksa detail pengajuan untuk informasi lebih
              lanjut.
            </p>

            <NavigationButton
              url={"/pengajuan-izin/" + permission.id}
              size="lg"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-svh p-6 bg-gradient-to-t from-primary to-background flex flex-col justify-end">
      <div className="flex justify-center mb-8 items-center w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <Mail width={100} height={100} className="text-primary" />
        </div>
      </div>
      <PermissionEditForm initialData={permission} />;
    </div>
  );
}
