"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export function RefreshButton({ buttonText }: { buttonText?: string }) {
  function handleRefresh() {
    location.reload();
  }

  return (
    <Button onClick={handleRefresh} variant={"outline"} size={"lg"}>
      <RefreshCcw /> {buttonText}
    </Button>
  );
}
