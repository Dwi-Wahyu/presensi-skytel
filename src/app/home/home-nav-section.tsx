"use client";

import { Button } from "@/components/ui/button";
import { IconCalendarClock, IconClipboardData } from "@tabler/icons-react";
import { Mail } from "lucide-react";
import Link from "next/link";

export function HomeNavSection() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <Link
        className="hover:scale-105 transition-all ease-in-out duration-300 overflow-hidden shadow-lg bg-gradient-to-tr from-primary to-primary/60 w-full relative rounded-xl  p-5"
        href={"/presensi/history"}
      >
        <div className="w-full pr-24 text-background">
          <h1 className="text-lg font-semibold">History</h1>
          <h1 className="text-sm">History Presensi Anda Dari Waktu Ke Waktu</h1>
          <Button
            variant={"link"}
            className="mt-2 bg-transparent p-0 underline underline-offset-2 text-background"
          >
            Lihat History
          </Button>
        </div>

        <IconClipboardData className="absolute -right-7 -top-7 w-36 h-36 text-background" />
      </Link>

      <Link
        className="hover:scale-105 transition-all ease-in-out duration-300 overflow-hidden shadow-lg bg-gradient-to-tr from-primary to-primary/60 w-full relative rounded-xl  p-5"
        href={"/presensi/catat"}
      >
        <div className="w-full pr-20 text-background">
          <h1 className="text-lg font-semibold">Clock In / Clock Out</h1>
          <h1 className="text-sm">Catat Presensi Anda Hari Ini</h1>
          <Button
            variant={"link"}
            className="mt-2 bg-transparent p-0 underline underline-offset-2 text-background"
          >
            Catat Presensi
          </Button>
        </div>

        <IconCalendarClock className="absolute -right-8 -top-4 w-36 h-36 text-background" />
      </Link>

      <Link
        className="hover:scale-105 transition-all ease-in-out duration-300 overflow-hidden shadow-lg bg-gradient-to-tr from-primary to-primary/60 w-full relative rounded-xl  p-5"
        href={"/pengajuan-izin"}
      >
        <div className="w-full pr-24 text-background">
          <h1 className="text-lg font-semibold">Izin / Cuti</h1>
          <h1 className="text-sm">
            Lihat Daftar Pengajuan Atau Buat Pengajuan Baru
          </h1>
          <Button
            variant={"link"}
            className="mt-2 bg-transparent p-0 underline underline-offset-2 text-background"
          >
            Lihat Menu
          </Button>
        </div>

        <Mail className="absolute -right-10 -top-5 w-36 h-36 text-background" />
      </Link>
    </div>
  );
}
