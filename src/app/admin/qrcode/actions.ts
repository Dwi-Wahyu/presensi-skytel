"use server";

import { revalidatePath } from "next/cache";

export async function refreshAction() {
  revalidatePath("/admin/qrcode");
}
