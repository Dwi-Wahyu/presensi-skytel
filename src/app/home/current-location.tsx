"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDistance } from "@/services/calculate_distance";
import {
  IconExclamationCircle,
  IconMap2,
  IconRefresh,
} from "@tabler/icons-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPinOff } from "lucide-react";

export function CurrentLocation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState(false);

  function askForPermission() {
    if (!navigator.geolocation) {
      router.push("/location-not-supported");
    }

    handleGetLocation();
  }

  function handleGetLocation() {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const dist = await calculateDistance(lat, lng);

            setLocation({
              lat,
              lng,
            });

            setDistance(dist);
          } catch (error) {
            console.log(error);
            setError(true);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.log(error);
          setLoading(false);
          setError(true);
        }
      );
    } else {
      setLoading(false);
      setError(true);
    }
  }

  useEffect(() => {
    askForPermission();
  }, []);

  if (loading) {
    return <LoadingLocation />;
  }

  if (error) {
    return <ErrorLocation />;
  }

  return (
    <Card className="my-6">
      <CardContent>
        <div className="inline-flex justify-between w-full mb-2 items-center">
          <div className="inline-flex gap-1">
            <IconMap2 />
            <h1 className="font-semibold text-lg">Lokasi Anda</h1>
          </div>

          <Button size={"icon"} variant={"outline"} onClick={handleGetLocation}>
            <IconRefresh />
          </Button>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <div>
            <h1>Latitude</h1>
            <h1 className="text-muted-foreground">{location?.lat}</h1>
          </div>
          <div>
            <h1>Longitude</h1>
            <h1 className="text-muted-foreground">{location?.lng}</h1>
          </div>
          <div>
            <h1>Jarak Anda Ke Titik Presensi</h1>
            <h1 className="text-muted-foreground">
              {distance?.toFixed(0)} Meter
            </h1>
          </div>
          <div>
            <h1>Jarak Maksimum Presensi</h1>
            <h1 className="text-muted-foreground">50 Meter</h1>
          </div>
        </div>

        {distance && distance > 50 && (
          <Alert variant="destructive">
            <IconExclamationCircle />
            <AlertTitle>Anda Tidak Dapat Melakukan Presensi!</AlertTitle>
            <AlertDescription>
              Klik icon refresh untuk membaca ulang lokasi anda
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingLocation() {
  return (
    <Card className="my-6">
      <CardContent>
        <div className="inline-flex justify-between w-full mb-2 items-center">
          <div className="inline-flex gap-1">
            <IconMap2 />
            <h1 className="font-semibold text-lg">Lokasi Anda</h1>
          </div>

          <Button disabled size={"icon"} variant={"outline"}>
            <IconRefresh className="animate-spin" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <div>
            <Skeleton className="mb-1 w-24 h-4" />
            <Skeleton className="w-28 h-4" />
          </div>

          <div>
            <Skeleton className="mb-1 w-20 h-4" />
            <Skeleton className="w-28 h-4" />
          </div>

          <div>
            <Skeleton className="mb-1 w-32 h-4" />
            <Skeleton className="w-36 h-4" />
          </div>

          <div>
            <Skeleton className="mb-1 w-28 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorLocation() {
  return (
    <Card className="my-6">
      <CardContent>
        <Alert variant="destructive" className="border-0 p-0">
          <MapPinOff />
          <AlertTitle>Gagal Membaca Lokasi</AlertTitle>
          <AlertDescription>
            <p>
              Kami tidak dapat mengakses lokasi Anda. Silakan periksa hal
              berikut:
            </p>
            <ul className="list-inside list-disc text-sm mt-2">
              <li>Pastikan layanan GPS/Location di perangkat aktif</li>
              <li>Izinkan aplikasi untuk mengakses lokasi</li>
              <li>Periksa koneksi internet Anda</li>
              <li>Coba muat ulang halaman</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
