import UnauthorizedPage from "@/app/_components/unauthorized-page";
import {
  countAllNotifications,
  getNotifications,
} from "@/app/notifikasi/queries";
import { auth } from "@/config/auth";
import { AdminNotificationSection } from "../admin-notification-section";

export default async function AdminNotificationPage() {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

  const notifications = await getNotifications(session.user.id);

  const totalNotifications = await countAllNotifications(session.user.id);

  return (
    <AdminNotificationSection
      notifications={notifications}
      user_id={session.user.id}
      total={totalNotifications}
      show_navigation_button={true}
    />
  );
}
