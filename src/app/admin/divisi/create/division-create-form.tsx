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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { IconChevronLeft, IconLoader, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { NotificationDialog } from "@/components/notification-dialog";

import { useRouter } from "nextjs-toploader/app";
import {
  InputDivisionSchema,
  InputDivisionSchemaType,
} from "@/validations/schemas/division";
import MultipleSelector from "@/components/multiple-select";
import { getAllUsers } from "../queries";
import { createDivision } from "../actions";

export function CreateDivisionForm({
  allUsers,
}: {
  allUsers: Awaited<ReturnType<typeof getAllUsers>>;
}) {
  const router = useRouter();

  const form = useForm<InputDivisionSchemaType>({
    resolver: zodResolver(InputDivisionSchema),
    defaultValues: {
      name: "",
      users: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Terjadi kesalahan saat menyimpan data karyawan. Silakan coba lagi."
  );

  const onSubmit = async (payload: InputDivisionSchemaType) => {
    setIsLoading(true);

    const result = await createDivision(payload);

    if (result.success) {
      setIsSuccessOpen(true);
      setTimeout(() => {
        router.push("/admin/divisi");
      }, 2000);
    } else {
      setErrorMessage(result.error.message);
      setIsErrorOpen(true);
    }

    setIsLoading(false);
  };

  const usersOptions = allUsers.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <div className="w-full flex justify-center">
      <NotificationDialog
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Aksi Berhasil!"
        message="Berhasil Input Divisi"
        variant="success"
      />

      <NotificationDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Gagal menyimpan divisi!"
        message={errorMessage}
        variant="error"
      />

      <Card className="w-full relative max-w-xl shadow-none">
        <Button
          className="top-6 hidden md:inline-flex absolute -left-14"
          variant={"secondary"}
          asChild
        >
          <Link href="/admin/divisi">
            <IconChevronLeft />
          </Link>
        </Button>
        <CardHeader>
          <CardTitle>Input Divisi</CardTitle>
          <CardDescription>
            Isi detail di bawah untuk input divisi baru
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Divisi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anggota</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        options={usersOptions}
                        value={field.value}
                        onChange={field.onChange}
                        emptyIndicator={<div>User Tidak Ditemukan</div>}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leader_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pemimpin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Pemimpin Divisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allUsers.map((user, idx) => (
                          <SelectItem value={user.id} key={idx}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  className="inline-flex md:hidden"
                  variant={"secondary"}
                  asChild
                >
                  <Link href="/admin/divisi">
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
                      <IconPlus />
                      Submit
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
