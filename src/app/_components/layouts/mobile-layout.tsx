import React from "react";
import { HomeTopbar } from "../home-topbar";
import { BottomBar } from "../bottom-bar";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-[#3190ec] bg-gradient-to-b to-blue-300 min-h-svh">
      <HomeTopbar />

      <div className="px-5 py-4">{children}</div>

      <div className="pb-24"></div>

      <BottomBar />
    </div>
  );
}
