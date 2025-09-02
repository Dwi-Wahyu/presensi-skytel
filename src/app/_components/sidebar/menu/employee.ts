import IconPrajurit from "@/components/icons/prajurit";
import {
  IconClipboardText,
  IconNews,
  IconUserScreen,
} from "@tabler/icons-react";

import {
  BookUser,
  DatabaseBackup,
  LayoutDashboard,
  ScrollText,
  Settings,
  University,
} from "lucide-react";

export const employeeMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Data Prajurit",
      url: "/admin/prajurit",
      icon: IconPrajurit,
    },
    {
      title: "Buku Saku Prajurit",
      url: "/admin/bukusaku",
      icon: BookUser,
    },
    {
      title: "Manajemen User",
      url: "/admin/manajemen-user",
      icon: IconUserScreen,
    },
    {
      title: "Berita",
      url: "/admin/berita",
      icon: IconNews,
      child: [
        {
          title: "Daftar Berita",
          url: "/admin/berita",
        },
        {
          title: "Tambah Berita",
          url: "/admin/berita/create",
        },
        {
          title: "Media Berita",
          url: "/admin/berita/media",
        },
      ],
    },
  ],
  navPenilaian: [],
  navSetting: [
    {
      title: "Kesatuan",
      url: "/admin/kesatuan",
      icon: University,
    },
    {
      title: "Backup Nilai",
      url: "/admin/backup-nilai",
      icon: DatabaseBackup,
      child: [
        {
          title: "Kesegaran Jasmani",
          url: "/admin/backup-nilai/kesegaran-jasmani",
        },
        {
          title: "Latihan Satuan",
          url: "/admin/backup-nilai/latihan-satuan",
        },
        {
          title: "UTP Umum Dan Jabatan",
          url: "/admin/backup-nilai/utp-umum-dan-jabatan",
        },
        {
          title: "Bak Pan",
          url: "/admin/backup-nilai/bak-pan",
        },
        {
          title: "Bak Pistol",
          url: "/admin/backup-nilai/bak-pistol",
        },
      ],
    },
    {
      title: "Pengaturan Aplikasi",
      url: "/admin/pengaturan-aplikasi",
      icon: Settings,
    },
    {
      title: "Audit Log",
      url: "/admin/audit-log",
      icon: ScrollText,
    },
  ],
};
