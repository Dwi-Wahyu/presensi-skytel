import { PageTitle } from "@/app/_components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "nuqs";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getAttendancesData } from "./queries";
import { AttendanceSearchParams } from "@/validations/search-params/attendance-search-params";
import { TabelAttendance } from "./tabel-attendance";
import { Separator } from "@/components/ui/separator";
import { PageDescription } from "@/app/_components/page-description";
import { IconClipboardData, IconUsers } from "@tabler/icons-react";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function KehadiranPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = AttendanceSearchParams.parse(searchParams);

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const promises = await getAttendancesData(search);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-5">
          <IconClipboardData className="w-11 h-11" />

          <div>
            <PageTitle title="Data Kehadiran" />
            <PageDescription text="Daftar Kehadiran Karyawan" />
          </div>
        </div>
        <Suspense fallback={<DataTableSkeleton columnCount={3} />}>
          <TabelAttendance promises={promises} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
