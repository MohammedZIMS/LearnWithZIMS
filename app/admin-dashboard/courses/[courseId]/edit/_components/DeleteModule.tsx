"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteModule } from "../actions";
import { toast } from "sonner";

export function DeleteModule({
  moduleId,
  courseId,
  moduleTitle = "this", // fallback title
}: {
  moduleId: string;
  courseId: string;
  moduleTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, startTransition] = useTransition();

  async function onSubmit() {
    setIsDeleting(true);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteModule({ courseId, moduleId })
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        setIsDeleting(false);
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        setOpen(false); // Close dialog on success
      } else {
        toast.error(result?.message || "Failed to delete module.");
      }

      setIsDeleting(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(value) => !isDeleting && setOpen(value)}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Delete Module"
          className="hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-lg p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-destructive/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Trash2 className="size-6 text-destructive" />
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Delete “{moduleTitle}” module?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-muted-foreground mt-2">
              This action cannot be undone. All module content including videos,
              resources, and student progress will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel
            disabled={isDeleting}
            className="mt-0 border-border hover:bg-accent flex-1 py-4"
          >
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={onSubmit}
            disabled={isDeleting}
            variant="destructive"
            className="flex-1 min-w-[120px] py-4"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Module"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
