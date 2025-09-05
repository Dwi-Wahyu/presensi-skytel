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
import { updateSettings } from "./actions";
import { NotificationDialog } from "@/components/notification-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

type Props = {
  MINIMUM_LATE_THRESHOLD: string;
  OVERTIME_THRESHOLD: string;
  CLOCK_IN_TIME: string;
  CLOCK_OUT_TIME: string;
};

export function SettingEditForm({
  MINIMUM_LATE_THRESHOLD,
  OVERTIME_THRESHOLD,
  CLOCK_IN_TIME,
  CLOCK_OUT_TIME,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateSettingSchemaType>({
    resolver: zodResolver(UpdateSettingSchema) as any,
    defaultValues: {
      MINIMUM_LATE_THRESHOLD: Number(MINIMUM_LATE_THRESHOLD),
      OVERTIME_THRESHOLD: Number(OVERTIME_THRESHOLD),
      CLOCK_IN_TIME,
      CLOCK_OUT_TIME,
    },
  });

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Terjadi kesalahan saat menyimpan pengaturan. Silakan coba lagi."
  );

  const [pendingData, setPendingData] =
    useState<UpdateSettingSchemaType | null>(null);

  const handleClickSubmit = async (payload: UpdateSettingSchemaType) => {
    setPendingData(payload);
    setIsConfirmDialogOpen(true);
  };

  const handleSubmit = async (payload: UpdateSettingSchemaType) => {
    setIsConfirmDialogOpen(false);
    setIsLoading(true);

    const result = await updateSettings(payload);

    if (result.success) {
      setIsSuccessOpen(true);
      setIsEditing(false);
    } else {
      setErrorMessage(result.error.message);
      setIsErrorOpen(true);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <NotificationDialog
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Aksi Berhasil!"
        message="Pengaturan aplikasi berhasil diubah."
        variant="success"
      />

      <NotificationDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title={errorMessage}
        message={errorMessage}
        variant="error"
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => pendingData && handleSubmit(pendingData)}
        title="Konfirmasi Perubahan Pengaturan"
        message={`Apakah Anda yakin ingin mengubah pengaturan ? Tindakan ini akan berdampak pada mekanisme pencatatan kehadiran aplikasi.`}
        confirmButtonText={isLoading ? "Loading..." : "Yakin"}
        cancelButtonText="Batal"
        isLoading={isLoading}
        confirmButtonVariant="destructive"
      />

      <form
        onSubmit={form.handleSubmit(handleClickSubmit)}
        className="flex flex-col gap-7"
      >
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
                    type="number"
                    disabled={!isEditing}
                    placeholder="1"
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
                    type="number"
                    disabled={!isEditing}
                    placeholder="60"
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
