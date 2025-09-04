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
import { FilterDatePicker } from "@/components/filter-date-picker";
import { TabelPermissionColumns } from "./tabel-permission-columns";
import { getPermissionsData } from "./queries";

type TableType = Awaited<ReturnType<typeof getPermissionsData>>;

export type PermissionColumnType = TableType["data"][number];

export function TabelPermission({ promises }: { promises: TableType }) {
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
    columns: TabelPermissionColumns,
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
          </div>
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}
