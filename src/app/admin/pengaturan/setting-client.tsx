"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateSettingSchema,
  UpdateSettingSchemaType,
} from "@/validations/schemas/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  MINIMUM_LATE_THRESHOLD: string;
  OVERTIME_THRESHOLD: string;
  CLOCK_IN_TIME: string;
  CLOCK_OUT_TIME: string;
};

export function SettingClient({
  MINIMUM_LATE_THRESHOLD,
  OVERTIME_THRESHOLD,
  CLOCK_IN_TIME,
  CLOCK_OUT_TIME,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateSettingSchemaType>({
    resolver: zodResolver(UpdateSettingSchema),
    defaultValues: {
      MINIMUM_LATE_THRESHOLD,
      OVERTIME_THRESHOLD,
      CLOCK_IN_TIME,
      CLOCK_OUT_TIME,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Terjadi kesalahan saat menyimpan data prajurit. Silakan coba lagi."
  );

  const onSubmit = async (payload: UpdateSettingSchemaType) => {
    setIsLoading(true);

    toast.info("Fitur Akan Segera Tersedia");

    // const result = await createEmployee(payload);

    // if (result.success) {
    //   setIsSuccessOpen(true);
    //   setTimeout(() => {
    //     router.push("/admin/karyawan");
    //   }, 1000);
    // } else {
    //   setErrorMessage(result.error.message);
    //   setIsErrorOpen(true);
    // }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="CLOCK_IN_TIME"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Masuk</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="peer appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CLOCK_OUT_TIME"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Pulang</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="peer appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="MINIMUM_LATE_THRESHOLD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Maksimum Keterlambatan</FormLabel>
                <FormControl>
                  <div className="relative grow">
                    <Input
                      className="peer pe-13"
                      type="text"
                      disabled={!isEditing}
                      {...field}
                    />
                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      Menit
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="OVERTIME_THRESHOLD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Minimum Lembur</FormLabel>
                <FormControl>
                  <div className="relative grow">
                    <Input
                      className="peer pe-13"
                      type="text"
                      disabled={!isEditing}
                      {...field}
                    />
                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      Menit
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Todo: nanti gunakan form field */}
        <div className="flex gap-2 items-center">
          <Checkbox />
          <FormLabel>
            Terapkan Pemeriksaan Lokasi Ketika Mencatat Presensi
          </FormLabel>
        </div>

        <div className="flex justify-center gap-3">
          {isEditing ? (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={"outline"}
              type="button"
            >
              Batalkan
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={"outline"}
              type="button"
            >
              Edit
            </Button>
          )}
          <Button disabled={!isEditing}>
            <Save /> Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
}
