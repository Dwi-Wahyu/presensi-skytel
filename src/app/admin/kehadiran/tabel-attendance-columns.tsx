"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceColumnType } from "./tabel-attendance";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDate } from "@/helper/date-helper";
import { attendanceStatusMapping } from "@/constant/attendance-status-mapping";
import { formatToHour } from "@/helper/hour-helper";

export const TabelAttendanceColumns: ColumnDef<AttendanceColumnType>[] = [
  {
    accessorKey: "user.name",
    header: "Nama",
  },
  {
    header: "Tanggal",
    cell: function Cell({ row }) {
      const { date } = row.original;

      return <div>{formatDate(date)}</div>;
    },
  },
  {
    header: "Clock In",
    cell: function Cell({ row }) {
      return <div>{formatToHour(row.original.clock_in_at)}</div>;
    },
  },
  {
    header: "Clock Out",
    cell: function Cell({ row }) {
      return <div>{formatToHour(row.original.clock_out_at)}</div>;
    },
  },
  {
    header: "Status",
    cell: function Cell({ row }) {
      return <div>{attendanceStatusMapping[row.original.status]}</div>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const { id } = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/kehadiran/edit/${id}`}>
                  <SquarePen className="mb-[1px] h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/kehadiran/${id}`}>
                  <Eye className="mb-[1px] h-4 w-4" /> Detail
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    size: 5,
  },
];
