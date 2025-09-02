export function getGolongan(usia: number): number {
  if (usia >= 18 && usia <= 25) return 1;
  if (usia >= 26 && usia <= 30) return 2;
  if (usia >= 31 && usia <= 35) return 3;
  if (usia >= 36 && usia <= 40) return 4;
  if (usia >= 41 && usia <= 43) return 5;
  if (usia >= 44 && usia <= 46) return 6;
  if (usia >= 47 && usia <= 49) return 7;
  if (usia >= 50 && usia <= 52) return 8;
  if (usia >= 53 && usia <= 55) return 9;
  if (usia >= 56 && usia <= 58) return 10;

  throw new Error(`Usia di luar rentang (18-58): ${usia}`);
}
