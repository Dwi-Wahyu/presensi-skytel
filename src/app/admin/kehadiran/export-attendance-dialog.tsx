"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IconFileTypeXls } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { ExportAttendanceData } from "./actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";

const exportSchema = z.object({
  startDate: z.string().min(1, "Tanggal mulai wajib diisi."),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi."),
});

type ExportFormData = z.infer<typeof exportSchema>;

export function ExportAttendanceDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<ExportFormData>({
    resolver: zodResolver(exportSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ExportFormData) => {
    setLoading(true);
    const startTime = new Date(data.startDate);
    const endTime = new Date(data.endDate);

    endTime.setHours(23, 59, 59, 999);

    const result = await ExportAttendanceData(startTime, endTime);

    if (result.success) {
      console.log(result.message);
      toast.success("Berhasil export data");
      setLoading(false);
      setOpen(false);
      if (result.filePath) redirect(result.filePath);
    } else {
      console.error(result.message);
      toast.error("Terjadi kesalahan saat export data");
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconFileTypeXls /> Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Export Data Kehadiran</DialogTitle>
            <DialogDescription>
              Tentukan rentang tanggal data kehadiran yang ingin Anda ekspor
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="startDate">Mulai</Label>
              <Input
                type="date"
                id="startDate"
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="endDate">Hingga</Label>
              <Input type="date" id="endDate" {...form.register("endDate")} />
              {form.formState.errors.endDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Batalkan
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="animate-spin" /> Loading
                </>
              ) : (
                <>
                  <IconFileTypeXls /> Export
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
