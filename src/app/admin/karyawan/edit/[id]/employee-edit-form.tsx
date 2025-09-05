"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { IconChevronLeft, IconLoader, IconPlus } from "@tabler/icons-react";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { useEffect, useState } from "react";
import { NotificationDialog } from "@/components/notification-dialog";
import {
  InputEmployeeSchema,
  InputEmployeeSchemaType,
  UpdateEmployeeSchema,
  UpdateEmployeeSchemaType,
} from "@/validations/schemas/employee";

import { useRouter } from "nextjs-toploader/app";
import { updateEmployee, uploadAvatar } from "../../actions";
import { getEmployeeById } from "../../queries";
import { Save } from "lucide-react";

export function EditEmployeeForm({
  initialData,
}: {
  initialData: NonNullable<Awaited<ReturnType<typeof getEmployeeById>>>;
}) {
  const router = useRouter();

  const form = useForm<UpdateEmployeeSchemaType>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      id: initialData.id,
      username: initialData.username,
      password: undefined,
      name: initialData.name,
      avatar: initialData.avatar,
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Terjadi kesalahan saat menyimpan data karyawan. Silakan coba lagi."
  );

  const onSubmit = async (payload: UpdateEmployeeSchemaType) => {
    setIsLoading(true);

    if (files.length > 0) {
      payload.avatar = await uploadAvatar(files[0], payload.username);
    }

    const result = await updateEmployee(payload);

    if (result.success) {
      setIsSuccessOpen(true);
      setTimeout(() => {
        router.push("/admin/karyawan");
      }, 2000);
    } else {
      setErrorMessage(result.error.message);
      setIsErrorOpen(true);
    }

    setIsLoading(false);
  };

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <div className="w-full flex justify-center">
      <NotificationDialog
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Aksi Berhasil!"
        message="Data karyawan berhasil disimpan."
        variant="success"
      />

      <NotificationDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Gagal menyimpan data karyawan!"
        message={errorMessage}
        variant="error"
      />

      <Card className="w-full relative max-w-xl shadow-none">
        <Button
          className="top-6 hidden md:inline-flex absolute -left-14"
          variant={"secondary"}
          asChild
        >
          <Link href="/admin/karyawan">
            <IconChevronLeft />
          </Link>
        </Button>
        <CardHeader>
          <CardTitle>Edit Karyawan</CardTitle>
          <CardDescription>
            Perbarui informasi karyawan yang sudah ada di dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-lg space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Kosongkan jika tidak ingin mengubah
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full">
                <h1 className="mb-2 text-sm">Pasfoto (Opsional)</h1>

                <FileUploadImage
                  multiple={false}
                  initialPreviewUrl={ADMIN_URL! + initialData.avatar}
                  onFilesChange={(newFiles) => {
                    setFiles(newFiles);
                  }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="inline-flex md:hidden"
                  variant={"secondary"}
                  asChild
                >
                  <Link href="/admin/karyawan">
                    <IconChevronLeft />
                    Kembali
                  </Link>
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <IconLoader className="animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      <Save />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
