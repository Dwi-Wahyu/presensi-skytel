import NotFoundResource from "@/app/_components/not-found-resource";
import { getEmployeeById } from "../../queries";
import { EditEmployeeForm } from "./employee-edit-form";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const employee = await getEmployeeById(id);

  if (!employee) {
    return <NotFoundResource />;
  }

  return <EditEmployeeForm initialData={employee} />;
}
