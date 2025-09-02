"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/helper/generate-breadcrumbs";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { ActivitySquare, Home, University } from "lucide-react";
import {
  IconClipboardText,
  IconMilitaryAward,
  IconTreadmill,
  IconUserScreen,
} from "@tabler/icons-react";
import { IconType } from "@/types/icon";
import IconPistol from "./icons/pistol";
import IconSenapan from "./icons/senapan";

type IconMapping = {
  label: string;
  icon: IconType;
}[];

const iconMapping: IconMapping = [
  { label: "Home", icon: Home },
  { label: "Kesatuan", icon: University },
  { label: "Manajemen User", icon: IconUserScreen },
  { label: "Penilaian", icon: IconClipboardText },
  { label: "Kesegaran Jasmani", icon: IconTreadmill },
  { label: "Bak Pistol", icon: IconPistol },
  { label: "Bak Pan", icon: IconSenapan },
  { label: "Latihan Satuan", icon: IconMilitaryAward },
];

export function BreadCrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  function getIconForLabel(label: string): IconType | undefined {
    return iconMapping.find((each) => each.label === label)?.icon;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="h-8 bg-sidebar gap-2 rounded-md border px-3 text-sm">
        {breadcrumbs.map((item, index) => {
          const IconComponent = getIconForLabel(item.label);

          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  {IconComponent && (
                    <IconComponent className="h-[15px] w-[15px] mb-[2px] mr-[2px]" />
                  )}
                  {item.label}
                </BreadcrumbPage>
              </BreadcrumbItem>

              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
