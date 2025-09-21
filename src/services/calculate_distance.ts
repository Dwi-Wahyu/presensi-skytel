"use server";

import {
  getOfficeLatitude,
  getOfficeLongitude,
} from "@/app/admin/pengaturan/queries";

const toRad = (value: number) => (value * Math.PI) / 180;

export async function calculateDistance(lat: number, lon: number) {
  const officeLatitude = await getOfficeLatitude();
  const officeLongitude = await getOfficeLongitude();

  if (officeLatitude == null || officeLongitude == null) return 0;

  console.log(lat, lon);

  const R = 6371000; // radius bumi dalam meter
  const dLat = toRad(officeLatitude - lat);
  const dLon = toRad(officeLongitude - lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) *
      Math.cos(toRad(officeLatitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // hasil dalam meter
}
