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

import { useState } from "react";
import { Loader, Save } from "lucide-react";
import {
  UpdateAttendanceSchema,
  UpdateAttendanceSchemaType,
} from "@/validations/schemas/attendance";
import { getAttendanceById } from "../../queries";
import { NotificationDialog } from "@/components/notification-dialog";
import { formatToHour } from "@/helper/hour-helper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDate, formatDateToYYYYMMDD } from "@/helper/date-helper";
import { updateAttendance } from "../../actions";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

export function AttendanceEditForm({
  initialData,
}: {
  initialData: NonNullable<Awaited<ReturnType<typeof getAttendanceById>>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Terjadi kesalahan saat menyimpan data kehadiran. Silakan coba lagi."
  );

  const form = useForm<UpdateAttendanceSchemaType>({
    resolver: zodResolver(UpdateAttendanceSchema),
    defaultValues: {
      id: initialData.id,
      clock_in_at: formatToHour(initialData.clock_in_at),
      clock_out_at: formatToHour(initialData.clock_out_at),
      overtime_hours: initialData.overtime_hours,
      status: initialData.status,
    },
  });

  console.log(form.formState.errors);

  const onSubmit = async (payload: UpdateAttendanceSchemaType) => {
    setIsLoading(true);

    try {
      const updateResult = await updateAttendance(payload);

      if (updateResult.success) {
        setIsLoading(false);
        setIsSuccessOpen(true);
      } else {
        setIsLoading(false);
        setErrorMessage(updateResult.error.message);
        setIsErrorOpen(true);
      }
    } catch (error) {
      setErrorMessage("Gagal menyimpan data.");
      setIsErrorOpen(true);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <NotificationDialog
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Aksi Berhasil!"
        message="Data kehadiran berhasil disimpan."
        variant="success"
      />

      <NotificationDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Gagal menyimpan data kehadiran!"
        message={errorMessage}
        variant="error"
      />

      <Card className="w-full relative max-w-xl shadow-none">
        <CardHeader>
          <CardTitle>Edit Kehadiran</CardTitle>
          <CardDescription>
            Perbarui informasi kehadiran pada tanggal tertentu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-lg space-y-6"
            >
              <div>
                <FormLabel>Karyawan</FormLabel>
                <div className="mt-2">
                  <Input disabled defaultValue={initialData.user.name} />
                </div>
              </div>

              <div>
                <FormLabel>Tanggal</FormLabel>
                <div className="mt-2">
                  <Input
                    type="date"
                    disabled
                    defaultValue={formatDateToYYYYMMDD(initialData.date)}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="clock_in_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Masuk</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clock_out_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Pulang</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtime_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Lembur (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ? field.value : 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Kehadiran</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="ATTEND" />
                          </FormControl>
                          <FormLabel className="font-normal">Hadir</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="ABSENT" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak Hadir
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="EXCUSED" />
                          </FormControl>
                          <FormLabel className="font-normal">Izin</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button asChild variant={"outline"}>
                  <Link href={"/admin/kehadiran"}>
                    <IconChevronLeft />
                    Kembali
                  </Link>
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" />
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
