"use client";

import GagalPresensi from "../gagal";
import { catatPresensi } from "./actions";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { calculateDistance } from "@/services/calculate_distance";
import LoadingCatatPresensi from "../loading-catat-presensi";
import { Check } from "lucide-react";

export default function CatatPresensiPage() {
  const session = useSession();
  const router = useRouter();

  const [loadingCalculate, setLoadingCalculate] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [isErrorCalculate, setIsErrorCalculate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function askForPermission(user_id: string) {
    if (!navigator.geolocation) {
      router.push("/location-not-supported");
      return;
    }
    handleGetLocation(user_id);
  }

  function handleGetLocation(user_id: string) {
    setLoadingCalculate(true);
    setIsErrorCalculate(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const dist = await calculateDistance(lat, lng);

          setLocation({ lat, lng });
          setDistance(dist);

          if (dist > 50) {
            setIsErrorCalculate(true);
            setErrorReason(
              "Tidak Dapat Mencatat Presensi. Jarak Anda melebihi 50 meter dari titik presensi."
            );
            return;
          }

          await handleCatat(user_id);
        } catch (err) {
          console.error(err);
          setIsErrorCalculate(true);
          setErrorReason("Terjadi kesalahan saat menghitung jarak.");
        } finally {
          setLoadingCalculate(false);
        }
      },
      (err) => {
        console.error(err);
        setLoadingCalculate(false);
        setIsErrorCalculate(true);
        setErrorReason("Tidak dapat membaca lokasi dari perangkat Anda.");
      }
    );
  }

  async function handleCatat(user_id: string) {
    setLoadingAttendance(true);

    try {
      const catat = await catatPresensi(user_id);

      if (!catat.success) {
        setErrorReason(catat.error.message);
        return;
      }

      if (!catat.data) {
        setErrorReason("Data presensi tidak ditemukan.");
        return;
      }

      if (catat.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      setErrorReason("Terjadi kesalahan saat mencatat presensi.");
      return;
    } finally {
      setLoadingAttendance(false);
    }
  }

  useEffect(() => {
    if (session.data) {
      askForPermission(session.data.user.id);
    }
  }, [session.data]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/presensi/sukses");
      }, 2000);
    }
  }, [isSuccess]);

  if (session.status === "loading") {
    return (
      <LoadingCatatPresensi>
        <h1 className="text-muted-foreground">Memuat sesi login</h1>

        <h1 className="text-muted-foreground">
          Menghitung jarak koordinat anda ke koordinat presensi
        </h1>

        <h1 className="text-muted-foreground">Proses mencatat presensi anda</h1>

        <h1 className="text-muted-foreground">
          Menampilkan data presensi anda hari ini
        </h1>
      </LoadingCatatPresensi>
    );
  }

  if (session.status === "unauthenticated" || !session.data) {
    return <UnauthorizedPage />;
  }

  if (loadingCalculate) {
    return (
      <LoadingCatatPresensi>
        <div className="flex gap-2 items-center">
          <Check className="w-5 h-5" />
          <h1>Memuat sesi login</h1>
        </div>

        <h1 className="text-muted-foreground">
          Menghitung jarak koordinat anda ke koordinat presensi
        </h1>

        <h1 className="text-muted-foreground">Proses mencatat presensi anda</h1>

        <h1 className="text-muted-foreground">
          Menampilkan data presensi anda hari ini
        </h1>
      </LoadingCatatPresensi>
    );
  }

  if (isErrorCalculate) {
    return (
      <GagalPresensi
        reason={
          "Tidak Dapat Mencatat Presensi. Jarak Anda melebihi 50 meter dari titik presensi."
        }
      />
    );
  }

  if (loadingAttendance) {
    return (
      <LoadingCatatPresensi>
        <div className="flex gap-2 items-center">
          <Check className="w-5 h-5" />
          <h1>Memuat sesi login</h1>
        </div>

        <div className="flex gap-2 items-center">
          <Check className="w-5 h-5" />
          <h1>Menghitung jarak koordinat anda ke koordinat presensi</h1>
        </div>

        <h1 className="text-muted-foreground">Proses mencatat presensi anda</h1>

        <h1 className="text-muted-foreground">
          Menampilkan data presensi anda hari ini
        </h1>
      </LoadingCatatPresensi>
    );
  }

  if (errorReason) {
    return <GagalPresensi reason={errorReason} />;
  }

  return (
    <LoadingCatatPresensi>
      <div className="flex gap-2 items-center">
        <Check className="w-5 h-5" />
        <h1>Memuat sesi login</h1>
      </div>

      <div className="flex gap-2 items-center">
        <Check className="w-5 h-5" />
        <h1>Menghitung jarak koordinat anda ke koordinat presensi</h1>
      </div>

      <div className="flex gap-2 items-center">
        <Check className="w-5 h-5" />
        <h1>Proses mencatat presensi anda</h1>
      </div>

      <h1 className="text-muted-foreground">
        Menampilkan data presensi anda hari ini
      </h1>
    </LoadingCatatPresensi>
  );
}
