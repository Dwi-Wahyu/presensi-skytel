"use client";

import { NavPenilaian } from "@/app/_components/sidebar/nav-penilaian";
import { NavMain } from "@/app/_components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Scroller } from "../../../components/ui/scroller";
import { getSidebarMenu } from "./menu";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { NavSetting } from "./nav-setting";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { Scan, ScanQrCode } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  const { data, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <LoadingSidebarMenu {...props} />;
  }

  if (!data) {
    router.push("/");
    return;
  }

  const menu = getSidebarMenu(data.user.role);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0 flex items-center justify-between">
            {open ? (
              <div className="flex gap-2 items-center">
                <ScanQrCode width={40} height={40} />

                <div>
                  <h1 className="text-xl font-bold leading-tight">
                    Presensi Digital
                  </h1>
                  <h1 className="text-sm text-muted-foreground leading-tight">
                    PT Skytel Indo
                  </h1>
                </div>
              </div>
            ) : (
              <ScanQrCode width={40} height={40} />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-10 pt-4">
        <Scroller orientation={"vertical"} hideScrollbar>
          <NavMain items={menu.navMain} />

          <div className="md:flex hidden  w-full justify-center">
            <SidebarTrigger />
          </div>
        </Scroller>
      </SidebarContent>
    </Sidebar>
  );
}

function LoadingSidebarMenu({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <ScanQrCode width={40} height={40} />

              <div>
                <h1 className="text-xl font-bold leading-tight">
                  Presensi Digital
                </h1>
                <h1 className="text-sm text-muted-foreground leading-tight">
                  PT Skytel Indo
                </h1>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-10 pt-4 px-4">
        <SidebarSkeleton />
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-16 h-3 bg-sidebar-foreground" />
        <Skeleton className="w-44 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-60 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-44 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-40 h-5 bg-sidebar-foreground" />
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <Skeleton className="w-16 h-3 bg-sidebar-foreground" />
        <Skeleton className="w-40 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-36 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-28 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-36 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
      </div>

      <div className="flex justify-center mt-2">
        <Skeleton className="w-8 h-8 bg-sidebar-foreground" />
      </div>
    </div>
  );
}
