"use client";

import { useState, useEffect } from "react";
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
import { IconLoader2 } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader, Save } from "lucide-react";
import { PermissionType } from "@/app/generated/prisma";
import {
  UpdatePermissionSchema,
  UpdatePermissionSchemaType,
} from "@/validations/schemas/permission";
import { getPermissionById } from "@/app/admin/pengajuan-izin/queries";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { updatePermission } from "../../actions";
import { NavigationButton } from "@/app/_components/navigation-button";

interface PermissionEditFormProps {
  initialData: NonNullable<Awaited<ReturnType<typeof getPermissionById>>>;
}

export function PermissionEditForm({ initialData }: PermissionEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<UpdatePermissionSchemaType>({
    resolver: zodResolver(UpdatePermissionSchema),
    defaultValues: {
      id: initialData.id,
      reason: initialData.reason,
      days_count: initialData.days_count,
      proof: initialData.proof,
      type: initialData.type,
      date_start: initialData.date_start,
      date_end: initialData.date_end,
    },
  });

  const onSubmit = async (values: UpdatePermissionSchemaType) => {
    setIsSubmitting(true);
    const result = await updatePermission(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error.message);
    }
  };

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Permohonan Izin</CardTitle>
        <CardDescription>Ubah detail permohonan izin Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perihal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan alasan Anda..."
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Izin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe izin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PermissionType.FULL}>
                        Izin Penuh (Cuti)
                      </SelectItem>
                      <SelectItem value={PermissionType.EARLY_LEAVE}>
                        Pulang Cepat
                      </SelectItem>
                      <SelectItem value={PermissionType.LATE}>
                        Datang Terlambat
                      </SelectItem>
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
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
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
                          disabled={(date) => date < new Date() || isSubmitting}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_end"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Selesai</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
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
                          disabled={(date) => date < new Date() || isSubmitting}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="days_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Hari</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proof"
              render={({ field: { value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Bukti</FormLabel>
                  <FormControl>
                    <FileUploadImage
                      multiple={false}
                      initialPreviewUrl={ADMIN_URL! + initialData.proof}
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
                url={"/pengajuan-izin/" + initialData.id}
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
