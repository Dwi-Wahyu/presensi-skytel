import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { DashboardAdmin } from "./dashboard-admin";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return <DashboardAdmin />;
}
