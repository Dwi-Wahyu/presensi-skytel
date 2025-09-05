import { auth } from "@/config/auth";
import { HomeTopbar } from "../_components/home-topbar";
import { HomeNavSection } from "./home-nav-section";
import UnauthorizedPage from "../_components/unauthorized-page";
import { WorkDurationChart } from "./work-duration-chart";
import { NotificationSection } from "../notifikasi/notification-section";
import { countAllNotifications, getNotifications } from "../notifikasi/queries";
import { ToggleDarkMode } from "@/components/toggle-darkmode";
import { getWorkDurationData } from "./queries";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  const recentNotifications = await getNotifications(session.user.id, 3);

  const totalNotifications = await countAllNotifications(session.user.id);

  const workDurationData = await getWorkDurationData(session.user.id);

  return (
    <div className="flex relative pt-20 flex-col gap-10 items-center w-full h-svh">
      <HomeTopbar />

      <div className="p-6 w-full">
        <h1 className="font-semibold text-lg">Selamat Datang !</h1>

        <div className="mt-4 mb-7 flex justify-between items-center">
          <div className="flex items-center gap-2 ">
            <img
              src={ADMIN_URL + session.user.avatar}
              alt="Profile Pict"
              width={50}
              height={50}
              className="rounded-lg"
            />

            <div>
              <h1 className="font-semibold text-lg">{session.user.name}</h1>
              <h1>{session.user.username}</h1>
            </div>
          </div>

          <ToggleDarkMode />
        </div>

        <HomeNavSection />

        <NotificationSection
          notifications={recentNotifications}
          total={totalNotifications}
          user_id={session.user.id}
          show_all_notifications_button={true}
        />

        <WorkDurationChart data={workDurationData} />
      </div>
    </div>
  );
}
