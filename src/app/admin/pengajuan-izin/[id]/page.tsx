import NotFoundResource from "@/app/_components/not-found-resource";

import { getPermissionById } from "../queries";

import { PermissionDetailPageClient } from "./admin-detail-pengajuan-client";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

export default async function PermissionDetailPage({
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
    <PermissionDetailPageClient
      permission={permission}
      user_id={session.user.id}
    />
  );
}
