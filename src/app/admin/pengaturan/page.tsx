import { PageTitle } from "@/app/_components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { SettingClient } from "./setting-client";
import { IconSettings } from "@tabler/icons-react";
import { getAllAppSettings } from "./queries";

type AppSettings = {
  CLOCK_IN_TIME: string;
  CLOCK_OUT_TIME: string;
  MINIMUM_LATE_THRESHOLD: string;
  OVERTIME_THRESHOLD: string;
};

export default async function SettingPage() {
  const allSettings = await getAllAppSettings();

  const settingsMap = allSettings.reduce(
    (map: Partial<AppSettings>, setting) => {
      map[setting.key as keyof AppSettings] = setting.value;
      return map;
    },
    {} as Partial<AppSettings>
  ) as AppSettings;

  console.log(settingsMap.CLOCK_IN_TIME);

  const {
    CLOCK_IN_TIME,
    CLOCK_OUT_TIME,
    MINIMUM_LATE_THRESHOLD,
    OVERTIME_THRESHOLD,
  } = settingsMap;

  return (
    <Card className="mx-auto w-2xl">
      <CardContent className="flex flex-col  gap-6">
        <div className="inline-flex justify-center items-center gap-1">
          <IconSettings />
          <PageTitle title="Pengaturan Aplikasi" />
        </div>

        <SettingClient
          CLOCK_IN_TIME={CLOCK_IN_TIME}
          CLOCK_OUT_TIME={CLOCK_OUT_TIME}
          MINIMUM_LATE_THRESHOLD={MINIMUM_LATE_THRESHOLD}
          OVERTIME_THRESHOLD={OVERTIME_THRESHOLD}
        />
      </CardContent>
    </Card>
  );
}
