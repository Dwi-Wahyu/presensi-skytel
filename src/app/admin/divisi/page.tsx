import { PageDescription } from "@/app/_components/page-description";
import { PageTitle } from "@/app/_components/page-title";
import { Button } from "@/components/ui/button";
import { IconBrandTeams, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { ListDivisionClient } from "./list-division-client";
import { getAllDivisions } from "./queries";

export default async function DivisionPage() {
  const allDivisions = await getAllDivisions(10);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-5">
          <IconBrandTeams className="w-11 h-11" />

          <div>
            <PageTitle title="Divisi Perusahaan" />
            <PageDescription text="Daftar Divisi Perusahaan" />
          </div>
        </div>

        <Button asChild>
          <Link href="/admin/divisi/create">
            <IconPlus /> Input Divisi
          </Link>
        </Button>
      </div>

      <ListDivisionClient allDivisions={allDivisions} />
    </div>
  );
}
