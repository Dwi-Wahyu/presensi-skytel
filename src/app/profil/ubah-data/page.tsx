import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getEmployeeById } from "@/app/admin/karyawan/queries";
import { auth } from "@/config/auth";
import { IconUserEdit } from "@tabler/icons-react";
import { ProfileEditForm } from "./profile-edit-form";
import NotFoundResource from "@/app/_components/not-found-resource";

export default async function ChangeProfilePage() {
  const session = await auth();

  if (!session) return <UnauthorizedPage />;

  const employee_data = await getEmployeeById(session.user.id);

  if (!employee_data) return <NotFoundResource />;

  return (
    <div className="w-full min-h-svh p-6 bg-gradient-to-t from-primary to-background flex flex-col justify-end">
      <div className="flex justify-center mb-8 items-center w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <IconUserEdit width={100} height={100} className="text-primary" />
        </div>
      </div>
      <ProfileEditForm initialData={employee_data} />;
    </div>
  );
}
