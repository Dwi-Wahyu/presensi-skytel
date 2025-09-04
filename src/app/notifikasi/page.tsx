import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getNotifications } from "./queries";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationSection } from "./notification-section";

export default async function EmployeeNotificationPage() {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

  const notifications = await getNotifications(session.user.id);

  return (
    <div className="w-full relative min-h-svh bg-gradient-to-t from-primary to-background text-primary-foreground p-6 md:p-10 flex flex-col justify-end">
      <div className="flex justify-center mb-1 items-center relative w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <IconBell width={100} height={100} className="text-primary" />
        </div>
      </div>

      <div className="min-h-[75vh]">
        <NotificationSection
          notifications={notifications}
          user_id={session.user.id}
          show_navigation_button={true}
        />
      </div>
    </div>
  );
}
