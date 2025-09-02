import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { catatPresensi } from "../actions";
import { QrCodeNotFound } from "../qrcode-not-found";
import GagalPresensi from "../gagal";
import SuksesPresensi from "../sukses";
import LoginForm from "@/app/login-form";
import { redirect } from "next/navigation";

export default async function PresensiQrCode({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const findId = await prisma.validQRCode.findFirst({
    where: { id },
  });

  if (!findId) {
    return <QrCodeNotFound />;
  }

  const session = await auth();

  if (!session) {
    return <LoginForm />;
  }

  const createdAttendance = await catatPresensi(session.user.username);

  if (!createdAttendance.success) {
    return <GagalPresensi reason={createdAttendance.error.message} />;
  }

  if (!createdAttendance.data) {
    return (
      <GagalPresensi reason="Terjadi kesalahan saat menampilkan data presensi" />
    );
  }

  if (createdAttendance.data.clockedOut) {
    redirect("/home");
  }

  return <SuksesPresensi attendance={createdAttendance.data.attendance} />;
}
