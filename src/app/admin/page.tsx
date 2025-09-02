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

// const barColors = [
//   "var(--chart-1)",
//   "var(--chart-2)",
//   "var(--chart-3)",
//   "var(--chart-4)",
//   "var(--chart-5)",
//   "var(--chart-6)",
//   "var(--chart-7)",
//   "var(--chart-8)",
//   "var(--chart-9)",
//   "var(--chart-10)",
// ];
