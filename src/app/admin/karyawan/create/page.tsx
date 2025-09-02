import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { CreateEmployeeForm } from "./employee-create-form";

export default async function InputEmployeePage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  if (session.user.role !== "admin") {
    return <UnauthorizedPage />;
  }

  return <CreateEmployeeForm />;
}
