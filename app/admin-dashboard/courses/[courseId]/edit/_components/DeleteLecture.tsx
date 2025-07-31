import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteLecture } from "../actions";
import { toast } from "sonner";

export function DeleteLecture({
    moduleId,
    courseId,
    lectureId,
    lectureTitle,
}: {
    moduleId: string;
    courseId: string;
    lectureId: string;
    lectureTitle?: string;
}) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            const { data: result, error } = await tryCatch(
                deleteLecture({ moduleId, courseId, lectureId })
            );

            if (error) {
                toast.error("An unexpected error occurred. Please try again");
                return;
            }

            if (result?.status === "success") {
                toast.success(result.message);
                setOpen(false);
            } else if (result?.status === "error") {
                toast.error(result.message);
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={(open) => !isDeleting && setOpen(open)}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    title="Delete Lecture"
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
                            Delete "{lectureTitle}" Lecture?
                        </AlertDialogTitle>
                        
                        <AlertDialogDescription className="text-muted-foreground mt-2">
                            This action cannot be undone. All lecture content including videos,
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
                        onClick={handleDelete}
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
                            "Delete Lecture"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}