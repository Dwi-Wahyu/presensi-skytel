"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getAllDivisions } from "./queries";
import { IconUsers, IconUserStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { deleteDivision } from "./actions";
import { toast } from "sonner";

export function ListDivisionClient({
  allDivisions,
}: {
  allDivisions: Awaited<ReturnType<typeof getAllDivisions>>;
}) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [division, setDivision] = useState<{
    id: string;
    name: string;
  } | null>();

  function handleDeleteClick(id: string, name: string) {
    setIsConfirmDialogOpen(true);
    setDivision({ id, name });
  }

  async function handleDelete() {
    if (division) {
      setIsDeleting(true);
      const result = await deleteDivision(division.id);

      if (result.success) {
        toast.success("Berhasil menghapus divisi");
      } else {
        toast.error("Terjadi kesalahan saat menghapus divisi");
      }
      setIsConfirmDialogOpen(false);
      setIsDeleting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setDivision(null);
        }}
        onConfirm={handleDelete}
        title="Konfirmasi Penghapusan"
        message={`Apakah Anda yakin ingin menghapus divisi "${division?.name}" ? Tindakan ini tidak dapat dibatalkan.`}
        confirmButtonText={isDeleting ? "Menghapus..." : "Hapus"}
        cancelButtonText="Batal"
        isLoading={isDeleting}
        confirmButtonVariant="destructive"
      />

      {allDivisions.map((division, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-lg">{division.name}</h1>

              <div className="flex gap-2 items-center">
                <Button variant={"outline"}>
                  <IconUsers />
                  {division.users.length}
                </Button>

                <Button size={"icon"}>
                  <Link href={"/admin/divisi/edit/" + division.id}>
                    <Edit />
                  </Link>
                </Button>

                <Button
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() => handleDeleteClick(division.id, division.name)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              {division.users.map((user, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <img
                    className="rounded-lg"
                    src={user.avatar ?? "/uploads/avatar/default-avatar.jpg"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                  />

                  <div>
                    <div
                      className={
                        division.leader_id === user.id
                          ? "font-semibold flex gap-1 items-center"
                          : ""
                      }
                    >
                      <h1>{user.name}</h1>

                      {division.leader_id === user.id && (
                        <IconUserStar className="w-4 h-4" />
                      )}
                    </div>
                    <h1 className="text-muted-foreground">{user.username}</h1>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant={"link"}>
              <Link href={"/admin/divisi/" + division.id}>Lihat Detail</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
