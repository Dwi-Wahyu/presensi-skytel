import NotFoundResource from "@/app/_components/not-found-resource";
import { getAllUsers, getDivisionById } from "../../queries";
import { EditDivisionForm } from "./division-edit-form";

export default async function EditDivisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const initialData = await getDivisionById(id);

  if (!initialData) {
    return <NotFoundResource />;
  }

  const allUsers = await getAllUsers();

  return <EditDivisionForm allUsers={allUsers} initialData={initialData} />;
}
