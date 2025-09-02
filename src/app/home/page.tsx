import { auth } from "@/config/auth";
import { HomeTopbar } from "../_components/home-topbar";
import { HomeNavSection } from "./home-nav-section";
import UnauthorizedPage from "../_components/unauthorized-page";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { JamKerjaChart } from "./jam-kerja-chart";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

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

          <Button variant={"outline"} size={"icon"}>
            <Settings />
          </Button>
        </div>

        <HomeNavSection />

        <JamKerjaChart />
      </div>
    </div>
  );
}
