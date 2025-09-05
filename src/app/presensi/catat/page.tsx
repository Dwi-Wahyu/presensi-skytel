import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import SuksesPresensi from "../sukses";
import GagalPresensi from "../gagal";
import { catatPresensi } from "./actions";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

export default async function CatatPresensiPage() {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

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
