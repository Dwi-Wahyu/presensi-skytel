import { MailPlus } from "lucide-react";
import { CreatePermissionForm } from "./permission-create-form";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

export default async function CreatePermissionPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="w-full min-h-svh p-6 bg-gradient-to-t from-primary to-background flex flex-col justify-end">
      <div className="flex justify-center mb-10 x items-center w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <MailPlus width={100} height={100} className="text-primary" />
        </div>
      </div>

      <CreatePermissionForm
        user_id={session.user.id}
        sender_name={session.user.name}
      />
    </div>
  );
}
