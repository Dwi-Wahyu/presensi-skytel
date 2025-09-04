import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { catatPresensi } from "./queries";
import SuksesPresensi from "../sukses";
import GagalPresensi from "../gagal";

export default async function CatatPresensiPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const catat = await catatPresensi(session.user.id);

  if (!catat.success) {
    return <GagalPresensi reason={catat.error.message} />;
  }

  if (!catat.data) {
    console.error("Operasi sukses, tetapi data tidak ditemukan.");
    return <GagalPresensi reason="Data Presensi tidak ditemukan" />;
  }

  redirect("/presensi/sukses");
}
