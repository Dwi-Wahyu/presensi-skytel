import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { HistoryPresensiClient } from "./history-client";
import { Button } from "@/components/ui/button";
import {
  IconChevronLeft,
  IconClipboardData,
  IconHome,
} from "@tabler/icons-react";
import { CalendarSearch } from "lucide-react";
import NotFoundResource from "@/app/_components/not-found-resource";
import Link from "next/link";

export default async function AttendanceHistoryPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const userDataAndAttendances = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    include: {
      attendances: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!userDataAndAttendances) {
    return <NotFoundResource />;
  }

  return (
    <div className="w-full relative min-h-screen  bg-gradient-to-t from-primary to-background text-primary-foreground p-6 md:p-10 flex flex-col justify-end">
      <div className="flex justify-center mb-8 items-center relative w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <IconClipboardData
            width={100}
            height={100}
            className="text-primary"
          />
        </div>
      </div>

      <div className="flex shadow-lg z-10 flex-col relative text-card-foreground bg-card rounded-lg gap-5">
        <h1 className="font-semibold text-lg px-6 pt-6">History Presensi</h1>

        <HistoryPresensiClient
          attendances={userDataAndAttendances.attendances}
        />

        <div className="flex justify-center p-6 relative bottom-0 left-0 gap-4">
          <Button asChild variant={"outline"} size={"lg"}>
            <Link href={"/home"}>Kembali</Link>
          </Button>

          <Button variant={"outline"} size={"lg"}>
            <CalendarSearch />
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
