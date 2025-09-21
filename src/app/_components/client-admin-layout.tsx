import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/app-sidebar";
import { BreadCrumbs } from "@/components/breadcrumb";
import TopbarAvatar from "@/components/topbar-avatar";

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 71)",
          "--header-height": "calc(var(--spacing) * 11)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className=" w-full">
        <div className="flex p-3 px-4 border-b-[1px] border-b-sidebar justify-between items-center w-full">
          <div className="flex gap-1 items-center">
            <SidebarTrigger />

            <BreadCrumbs />
          </div>

          <TopbarAvatar />
        </div>

        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
