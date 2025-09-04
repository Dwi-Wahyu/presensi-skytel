"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { IconBell, IconLoader2, IconTrash, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getNotifications } from "../notifikasi/queries";
import { deleteNotification } from "../notifikasi/actions";

export function AdminNotificationSection({
  notifications,
  user_id,
}: {
  notifications: Awaited<ReturnType<typeof getNotifications>>;
  user_id: string;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (notificationId: number) => {
    setDeletingId(notificationId);
    try {
      const result = await deleteNotification(notificationId, user_id);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error?.message || "Gagal menghapus notifikasi.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="mt-7 mb-7">
      <CardHeader>
        <CardTitle>Notifikasi Terbaru</CardTitle>
        <CardDescription>
          {notifications.length > 0
            ? "Berikut adalah notifikasi terbaru untuk Anda."
            : "Tidak ada notifikasi terbaru saat ini."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification: any) => (
              <div
                key={notification.id}
                className="relative border-b pb-2 last:border-b-0 last:pb-0 group"
              >
                <div className="flex justify-between items-start">
                  <Link
                    href={notification.resource_path || "#"}
                    className="flex-1 pr-10"
                  >
                    <p className="font-semibold text-sm">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(notification.created_at, "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </Link>

                  <Button
                    onClick={() => handleDelete(notification.id)}
                    disabled={deletingId === notification.id}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    {deletingId === notification.id ? (
                      <IconLoader2 className="animate-spin" />
                    ) : (
                      <IconX />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <IconBell className="w-16 h-16" />
            <p className="mt-2 text-sm">
              Anda belum memiliki notifikasi terbaru.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
