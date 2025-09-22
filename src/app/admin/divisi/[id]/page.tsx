import NotFoundResource from "@/app/_components/not-found-resource";
import { getDivisionById } from "../queries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IconUsers, IconUserStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationButton } from "@/app/_components/navigation-button";
import { Edit } from "lucide-react";
import { formatDate } from "@/helper/date-helper";

export default async function DivisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const division = await getDivisionById(id);

  if (!division) {
    return <NotFoundResource />;
  }

  return (
    <div className="container">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-lg">{division.name}</h1>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {division.leader && (
            <div>
              <h1 className="font-semibold mb-1">Pemimpin</h1>

              <div className="flex gap-2 items-center">
                <img
                  className="rounded-lg"
                  src={
                    division.leader.avatar ??
                    "/uploads/avatar/default-avatar.jpg"
                  }
                  alt="User Avatar"
                  width={40}
                  height={40}
                />

                <div>
                  <h1>{division.leader.name}</h1>
                  <h1 className="text-muted-foreground">
                    {division.leader.username}
                  </h1>
                </div>
              </div>
            </div>
          )}

          <div>
            <h1 className="font-semibold mb-1">Dibuat Pada</h1>

            <h1 className="text-muted-foreground">
              {formatDate(division.created_at)}
            </h1>
          </div>

          <div>
            <h1 className="font-semibold mb-1">Diperbarui Pada</h1>

            <h1 className="text-muted-foreground">
              {formatDate(division.updated_at)}
            </h1>
          </div>

          <div>
            <h1 className="font-semibold mb-1">Anggota</h1>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              {division.users.map((user, idx) => {
                if (user.id !== division.leader_id) {
                  return (
                    <div key={idx} className="flex gap-2 items-center">
                      <img
                        className="rounded-lg"
                        src={
                          user.avatar ?? "/uploads/avatar/default-avatar.jpg"
                        }
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
                        <h1 className="text-muted-foreground">
                          {user.username}
                        </h1>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <NavigationButton url="/admin/divisi" />
          <NavigationButton
            variant="default"
            url={"/admin/divisi/edit/" + division.id}
          >
            <Edit /> Edit
          </NavigationButton>
        </CardFooter>
      </Card>
    </div>
  );
}
