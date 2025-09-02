import {
  IconClipboardData,
  IconQrcode,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { LayoutDashboard, Mails } from "lucide-react";

export const adminMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Data Karyawan",
      url: "/admin/karyawan",
      icon: IconUsers,
    },
    {
      title: "Data Kehadiran",
      url: "/admin/kehadiran",
      icon: IconClipboardData,
    },
    {
      title: "Permohonan Izin",
      url: "/admin/permohonan-izin",
      icon: Mails,
    },
    {
      title: "QR Code",
      url: "/admin/qrcode",
      icon: IconQrcode,
    },
    {
      title: "Pengaturan",
      url: "/admin/pengaturan",
      icon: IconSettings,
    },
  ],
};
