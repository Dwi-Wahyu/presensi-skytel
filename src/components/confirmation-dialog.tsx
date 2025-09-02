import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: "default" | "success" | "destructive" | "secondary";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmButtonText = "Konfirmasi",
  cancelButtonText = "Batal",
  confirmButtonVariant = "secondary",
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader className="flex flex-col items-center text-center">
          <AlertCircle className="h-8 w-8 text-secondary" />{" "}
          {/* Ikon peringatan */}
          <DialogTitle className="text-xl font-bold mt-2">{title}</DialogTitle>
          <DialogDescription className="text-base text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
          {" "}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto rounded-full bg-card-foreground text-card hover:text-background hover:bg-card-foreground/90"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={confirmButtonVariant}
            className="w-full sm:w-auto rounded-full mb-2 sm:mb-0"
          >
            {isLoading ? (
              <IconLoader className="animate-spin" />
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
