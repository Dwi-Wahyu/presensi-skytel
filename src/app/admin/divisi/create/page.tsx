import { getAllUsers } from "../queries";
import { CreateDivisionForm } from "./division-create-form";

export default async function CreateDivisionPage() {
  const allUsers = await getAllUsers();

  return <CreateDivisionForm allUsers={allUsers} />;
}
