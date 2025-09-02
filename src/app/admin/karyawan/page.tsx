import { PageTitle } from "@/app/_components/page-title";
import { TabelEmployee } from "@/app/admin/karyawan/tabel-employee";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "nuqs";
import { UserSearchParams } from "@/validations/search-params/user-search-params";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getEmployeeData } from "./queries";
import { PageDescription } from "@/app/_components/page-description";
import { IconUsers } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function EmployeePage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = UserSearchParams.parse(searchParams);

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const promises = await getEmployeeData(search);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-5">
          <IconUsers className="w-11 h-11" />

          <div>
            <PageTitle title="Data Karyawan" />
            <PageDescription text="Manajemen Data Karyawan" />
          </div>
        </div>
        <Suspense fallback={<DataTableSkeleton columnCount={3} />}>
          <TabelEmployee promises={promises} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
