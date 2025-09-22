import {
  IconBrandTeams,
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
      title: "Divisi",
      url: "/admin/divisi",
      icon: IconBrandTeams,
    },
    {
      title: "Data Kehadiran",
      url: "/admin/kehadiran",
      icon: IconClipboardData,
    },
    {
      title: "Pengajuan Izin",
      url: "/admin/pengajuan-izin",
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
