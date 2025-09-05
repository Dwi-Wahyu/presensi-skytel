"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader, Save } from "lucide-react";
import {
  UpdateEmployeeSchema,
  UpdateEmployeeSchemaType,
} from "@/validations/schemas/employee";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { NavigationButton } from "@/app/_components/navigation-button";
import { getEmployeeById } from "@/app/admin/karyawan/queries";
import { updateEmployee } from "@/app/admin/karyawan/actions";
import { useRouter } from "nextjs-toploader/app";

interface EmployeeEditFormProps {
  initialData: NonNullable<Awaited<ReturnType<typeof getEmployeeById>>>;
}

export function ProfileEditForm({ initialData }: EmployeeEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  const form = useForm<UpdateEmployeeSchemaType>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      id: initialData.id,
      name: initialData.name,
      username: initialData.username,
      email: initialData.email ?? "",
      phone_number: initialData.phone_number ?? "",
      avatar: initialData.avatar ?? null,
    },
  });

  const onSubmit = async (values: UpdateEmployeeSchemaType) => {
    setIsSubmitting(true);
    const result = await updateEmployee(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Profil Berhasil Diperbarui");
      router.push("/profil");
    } else {
      toast.error(result.error.message);
    }
  };

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbarui Profil Karyawan</CardTitle>
        <CardDescription>
          Sesuaikan informasi dan detail profil karyawan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama lengkap..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan username..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan email..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nomor telepon..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Foto Profil</FormLabel>
                  <FormControl>
                    <FileUploadImage
                      multiple={false}
                      initialPreviewUrl={
                        initialData.avatar
                          ? ADMIN_URL! + initialData.avatar
                          : "/images/placeholder.svg"
                      }
                      onFilesChange={(newFiles) => {
                        setFiles(newFiles);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center gap-2 mt-4">
              <NavigationButton
                url={`/admin/karyawan/${initialData.id}`}
                size="lg"
              />
              <Button type="submit" disabled={isSubmitting} size={"lg"}>
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin mr-2" />
                    Memperbarui...
                  </>
                ) : (
                  <>
                    <Save />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
