"use client";

import { parseAsIsoDate, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";

import { Button } from "@/components/ui/button";
import { FunnelX } from "lucide-react";
import Link from "next/link";
import { IconFileTypeXls, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getAttendancesData } from "./queries";
import { TabelAttendanceColumns } from "./tabel-attendance-columns";
import { FilterDatePicker } from "@/components/filter-date-picker";
import { ExportAttendanceDialog } from "./export-attendance-dialog";

type TableType = Awaited<ReturnType<typeof getAttendancesData>>;

export type AttendanceColumnType = TableType["data"][number];

export function TabelAttendance({ promises }: { promises: TableType }) {
  const { data, filtered, pageCount } = promises;

  const [nama, setNama] = useQueryState("nama", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  const [date, setDate] = useQueryState("date", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  const { table } = useDataTable({
    data,
    columns: TabelAttendanceColumns,
    pageCount: pageCount,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  function handleClear() {
    setNama("");
    setDate(null);
  }

  const session = useSession();

  if (session.status === "unauthenticated") {
    return <UnauthorizedPage />;
  }

  const isAdmin = session.data?.user.role === "admin";

  return (
    <div>
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <div className="flex items-center justify-between w-full flex-col sm:flex-row">
            <div className="flex gap-2 items-center ">
              <Input
                placeholder="Cari Nama Karyawan"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <Input
                placeholder="Filter Tanggal"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Button variant={"outline"} onClick={handleClear}>
                <FunnelX />
              </Button>
            </div>

            <ExportAttendanceDialog />
          </div>
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}
