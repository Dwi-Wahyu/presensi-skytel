import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import ScannerPageClient from "./scanner-client";

export default async function ScannerPage() {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

  return <ScannerPageClient user_id={session.user.id} />;
}
