"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export function BackButton({ label = "Kembali" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant={"outline"}
      type="button"
      size={label === null ? "icon" : "default"}
    >
      {label}
    </Button>
  );
}

export function NavigationButton({
  label = "Kembali",
  url,
  size = "default",
}: {
  label?: string;
  url: string;
  size?: "default" | "sm" | "lg" | "icon";
}) {
  return (
    <Link href={url} passHref>
      <Button variant={"outline"} type="button" size={size}>
        {label}
      </Button>
    </Link>
  );
}
