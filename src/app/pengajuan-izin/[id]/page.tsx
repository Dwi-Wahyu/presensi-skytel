import NotFoundResource from "@/app/_components/not-found-resource";

import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getPermissionById } from "@/app/admin/pengajuan-izin/queries";
import { HomePermissionDetailPageClient } from "./home-detail-pengajuan-client";

export default async function PermissionDetailHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

  const { id } = await params;

  if (isNaN(parseInt(id))) return <NotFoundResource />;

  const permission = await getPermissionById(parseInt(id));

  if (!permission) return <NotFoundResource />;

  return (
    <HomePermissionDetailPageClient
      permission={permission}
      user_id={session.user.id}
    />
  );
}
