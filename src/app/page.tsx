import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { auth } from "@/config/auth";

export default async function LoginPage() {
  const session = await auth();

  if (!session) {
    return <LoginForm />;
  }

  const now = new Date();
  const expires = new Date(session.expires);

  if (now > expires || !session) {
    return <LoginForm />;
  }

  redirect("/admin");
}
