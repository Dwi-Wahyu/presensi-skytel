"use client";

import {
  IconAddressBook,
  IconBook2,
  IconHome,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomBar() {
  const pathname = usePathname();

  function isPathActive(path: string) {
    return path === pathname;
  }

  return (
    <div className="flex fixed bottom-0 left-0 w-full py-4 bg-white text-black justify-evenly">
      <Link className={`flex flex-col gap-1 items-center`} href={"/beranda"}>
        <div
          className={
            isPathActive("/beranda")
              ? "p-3 bg-primary text-white rounded-full"
              : "p-3"
          }
        >
          <IconHome />
        </div>
      </Link>

      <Link className={`flex flex-col gap-1 items-center`} href={"/profil"}>
        <div
          className={
            isPathActive("/profil")
              ? "p-3 bg-primary text-white rounded-full"
              : "p-3"
          }
        >
          <IconUser />
        </div>
      </Link>

      <Link className={`flex flex-col gap-1 items-center`} href={"/bukusaku"}>
        <div
          className={
            isPathActive("/bukusaku")
              ? "p-3 bg-primary text-white rounded-full"
              : "p-3"
          }
        >
          <IconBook2 />
        </div>
      </Link>

      <Link className={`flex flex-col gap-1 items-center`} href={"/pengaturan"}>
        <div
          className={
            isPathActive("/pengaturan")
              ? "p-3 bg-primary text-primary-foreground rounded-full"
              : "p-3"
          }
        >
          <IconSettings />
        </div>
      </Link>
    </div>
  );
}
