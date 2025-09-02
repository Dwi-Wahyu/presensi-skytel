export function getKeterangan(
  bakType: "utp" | "latihan-satuan" | "senapan" | "pistol",
  nilai_akhir: number
) {
  switch (bakType) {
    case "utp":
    case "latihan-satuan":
      if (nilai_akhir >= 81 && nilai_akhir <= 100) {
        return "LULUS (BS)";
      } else if (nilai_akhir >= 61 && nilai_akhir < 81) {
        return "LULUS (B)";
      } else if (nilai_akhir >= 41 && nilai_akhir < 61) {
        return "LULUS (C)";
      } else if (nilai_akhir >= 21 && nilai_akhir < 41) {
        return "TIDAK LULUS (K)";
      } else if (nilai_akhir >= 0 && nilai_akhir < 21) {
        return "TIDAK LULUS (KS)";
      } else {
        return "Nilai tidak valid";
      }
    case "senapan":
      if (nilai_akhir >= 240) {
        return "LULUS (L)";
      } else {
        return "TIDAK LULUS (TL)";
      }
    case "pistol":
      if (nilai_akhir >= 70) {
        return "LULUS (L)";
      } else {
        return "TIDAK LULUS (TL)";
      }
  }
}
