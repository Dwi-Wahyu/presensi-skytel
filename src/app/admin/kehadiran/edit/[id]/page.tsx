import NotFoundResource from "@/app/_components/not-found-resource";
import { getAttendanceById } from "../../queries";
import { AttendanceEditForm } from "./attendance-edit-form";

export default async function EditAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(parseInt(id))) {
    return <NotFoundResource />;
  }

  const attendance = await getAttendanceById(parseInt(id));

  if (!attendance) {
    return <NotFoundResource />;
  }

  return <AttendanceEditForm initialData={attendance} />;
}
