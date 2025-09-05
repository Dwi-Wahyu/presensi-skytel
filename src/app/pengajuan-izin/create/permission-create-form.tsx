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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import {
  IconChevronLeft,
  IconLoader,
  IconPlus,
  IconCalendar,
} from "@tabler/icons-react";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { useEffect, useState } from "react";
import { NotificationDialog } from "@/components/notification-dialog";
import {
  InputPermissionSchema,
  InputPermissionSchemaType,
} from "@/validations/schemas/permission";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { addDays, differenceInDays, format, isBefore } from "date-fns";
import { createPermission, uploadProof } from "../actions";
import { id } from "date-fns/locale";
import {
  BackButton,
  NavigationButton,
} from "@/app/_components/navigation-button";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export function CreatePermissionForm({
  user_id,
  sender_name,
}: {
  user_id: string;
  sender_name: string;
}) {
  const router = useRouter();

  const form = useForm<InputPermissionSchemaType>({
    resolver: zodResolver(InputPermissionSchema),
    defaultValues: {
      reason: "",
      days_count: 1,
      proof: null,
      type: "FULL",
      user_id,
      date_start: new Date(),
      date_end: new Date(),
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const watchHari = form.watch("days_count");
  const watchDateStart = form.watch("date_start");
  const watchDateEnd = form.watch("date_end");

  useEffect(() => {
    if (!watchHari) return;

    const baseDate = watchDateStart ? new Date(watchDateStart) : new Date();

    const nextDateEnd =
      watchHari === 1 ? baseDate : addDays(baseDate, watchHari - 1);

    if (
      !watchDateEnd ||
      differenceInDays(nextDateEnd, new Date(watchDateEnd)) !== 0
    ) {
      form.setValue("date_end", nextDateEnd);
    }
  }, [watchHari, watchDateStart, watchDateEnd, form]);

  const onSubmit = async (payload: InputPermissionSchemaType) => {
    setIsLoading(true);

    if (files.length > 0) {
      payload.proof = await uploadProof(files[0], payload.user_id);
    }

    const result = await createPermission(payload, sender_name);

    if (result.success) {
      toast.success(result.message || "Permohonan izin berhasil diajukan.");
      router.push("/pengajuan-izin");
    } else {
      toast.error("Gagal mengajukan izin!", {
        description: "result.error.message",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full relative max-w-xl shadow-none">
        <Button
          className="top-6 hidden md:inline-flex absolute -left-14"
          variant={"secondary"}
          asChild
        >
          <Link href="/dashboard/izin-cuti">
            <IconChevronLeft />
          </Link>
        </Button>
        <CardHeader>
          <CardTitle>Ajukan Permohonan Izin</CardTitle>
          <CardDescription>
            Isi detail di bawah ini untuk mengajukan permohonan izin baru.
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
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perihal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Perihal mengajukan izin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="days_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Hari</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="1"
                        {...field}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (isNaN(val) || val < 1) {
                            field.onChange(1);
                          } else {
                            field.onChange(val);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Izin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih jenis izin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FULL">Izin Full Day</SelectItem>
                        <SelectItem value="EARLY_LEAVE">
                          Izin Pulang Cepat
                        </SelectItem>
                        <SelectItem value="LATE">Izin Terlambat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date_start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal {watchHari > 1 && "Mulai"}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: id })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || isLoading}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchHari > 1 && (
                  <FormField
                    control={form.control}
                    name="date_end"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Berakhir</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: id })
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || isLoading
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="w-full">
                <h1 className="mb-2 text-sm">Bukti (Opsional)</h1>
                <FileUploadImage
                  multiple={false}
                  onFilesChange={(newFiles) => {
                    setFiles(newFiles);
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <NavigationButton
                  label="Kembali"
                  url="/pengajuan-izin"
                  size="lg"
                />

                <Button type="submit" size={"lg"} disabled={isLoading}>
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
