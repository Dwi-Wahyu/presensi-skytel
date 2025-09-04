import { auth } from "@/config/auth";
import { ChangePasswordForm } from "./change-password-form";
import UnauthorizedPage from "../_components/unauthorized-page";

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="w-full relative min-h-screen  bg-gradient-to-t from-primary to-background text-primary-foreground p-6 md:p-10 flex flex-col justify-center">
      <ChangePasswordForm />
    </div>
  );
}
