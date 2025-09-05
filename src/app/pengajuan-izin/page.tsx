import { Button } from "@/components/ui/button";

import { MailPlus, MailQuestionMark, Mails, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { getPermissionsByEmployeeId } from "./queries";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconMailCheck, IconMailShare, IconMailX } from "@tabler/icons-react";

export default async function PermissionPage() {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

  const userPermission = await getPermissionsByEmployeeId(session.user.id);

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-t from-primary to-background flex flex-col justify-end">
      <div className="flex justify-center mb-8 items-center w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <Mails width={100} height={100} className="text-primary" />
        </div>
      </div>
      <div className="flex py-6 shadow-lg z-10 relative text-card-foreground bg-card rounded-lg h-[75vh] justify-between flex-col">
        <div>
          <h1 className="text-lg font-semibold text-center">
            Pengajuan Izin / Cuti
          </h1>
          <h1 className="text-muted-foreground text-center">
            Klik Untuk Melihat Detail
          </h1>
        </div>

        {userPermission.length === 0 ? (
          <EmptyPengajuanSection />
        ) : (
          <ScrollArea className="h-[55vh]">
            {userPermission.map((permission, idx) => (
              <Link
                key={idx}
                href={"/pengajuan-izin/" + permission.id}
                className="p-3 border items-center gap-2 mx-6 flex border-primary mb-4 rounded-lg shadow"
              >
                {permission.status === "PENDING" && (
                  <IconMailShare className="w-12 h-12 text-primary" />
                )}

                {permission.status === "APPROVED" && (
                  <IconMailCheck className="w-12 h-12 text-green-500" />
                )}

                {permission.status === "REJECTED" && (
                  <IconMailX className="w-12 h-12 text-destructive" />
                )}

                <div className="">
                  <h1 className="font-semibold text-sm">{permission.reason}</h1>
                  {formatDateToYYYYMMDD(permission.date_start) !==
                  formatDateToYYYYMMDD(permission.date_end) ? (
                    <h1 className="text-sm">
                      {formatDateToYYYYMMDD(permission.date_start)} -{" "}
                      {formatDateToYYYYMMDD(permission.date_end)}
                    </h1>
                  ) : (
                    <h1 className="text-sm">
                      {formatDateToYYYYMMDD(permission.date_start)}
                    </h1>
                  )}
                </div>
              </Link>
            ))}
          </ScrollArea>
        )}

        <div className="flex justify-center gap-2">
          <Button asChild size={"lg"} variant={"outline"}>
            <Link href={"/home"}>Kembali</Link>
          </Button>

          <Button asChild size={"lg"}>
            <Link href={"/pengajuan-izin/create"}>
              <MailPlus />
              Buat Pengajuan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyPengajuanSection() {
  return (
    <div className="w-full flex mt-4 justify-center gap-3 items-center flex-col">
      <h1 className="font-semibold">Anda Belum Membuat Pengajuan</h1>

      <MailQuestionMark width={40} height={40} />

      <h1 className="text-muted-foreground text-sm">
        Silakan buat pengajuan baru
      </h1>
    </div>
  );
}
