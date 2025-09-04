import { PageTitle } from "@/app/_components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "nuqs";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { PageDescription } from "@/app/_components/page-description";
import { IconClipboardData, IconUsers } from "@tabler/icons-react";
import { getPermissionsData } from "./queries";
import { PermissionSearchParams } from "@/validations/search-params/permission-search-params";
import { TabelPermission } from "./tabel-permission";
import { Mails } from "lucide-react";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PermissionPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = PermissionSearchParams.parse(searchParams);

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const promises = await getPermissionsData(search);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-5">
          <Mails className="w-11 h-11" />

          <div>
            <PageTitle title="Pengajuan Izin / Cuti" />
            <PageDescription text="Daftar pengajuan izin/cuti yang diajukan karyawan" />
          </div>
        </div>
        <Suspense fallback={<DataTableSkeleton columnCount={3} />}>
          <TabelPermission promises={promises} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
