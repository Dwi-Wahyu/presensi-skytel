"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IconType } from "@/types/icon";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import { Button } from "../../../components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: IconType;
    child?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { linkActive, setLinkActive } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col">
        <SidebarGroupLabel>MENU UTAMA</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => {
            const [isOpen, setIsOpen] = useState(false);

            return item.child ? (
              <Collapsible
                key={item.title}
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger className="cursor-pointer" asChild>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub
                      className="relative ml-4 pl-4 border-l border-muted" // vertical line
                    >
                      {item.child.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.url}>
                          <SidebarMenuButton
                            isActive={linkActive === subitem.url}
                            onClick={() => setLinkActive(subitem.url)}
                            tooltip={subitem.title}
                            asChild
                          >
                            <Link href={subitem.url}>{subitem.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={linkActive === item.url}
                  asChild
                  tooltip={item.title}
                  onClick={() => setLinkActive(item.url)}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
