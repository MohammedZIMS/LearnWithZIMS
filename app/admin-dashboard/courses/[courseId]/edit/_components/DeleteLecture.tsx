import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteLectureProps {
  onConfirm: () => Promise<void>;
  lectureTitle?: string;
}

export function DeleteLecture() {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);



  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Delete Lecture"
          className="hover:bg-destructive/10"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md rounded-lg">
        <AlertDialogHeader>
          <div className="bg-destructive/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Trash2 className="size-6 text-destructive" />
          </div>
          
          <AlertDialogTitle className="text-lg font-semibold">
            Delete {"Lecture"}
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. All lecture content including videos, 
            resources, and student progress will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-3 sm:gap-2">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="mt-0 flex-1 border-border hover:bg-accent"
          >
            Cancel
          </AlertDialogCancel>
          
          <Button
            disabled={isDeleting}
            variant="destructive"
            className="flex-1 min-w-[120px]"
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