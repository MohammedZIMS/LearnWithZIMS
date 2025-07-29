import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lectureSchema, LectureSchemaType, moduleSchema, ModuleSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createLecture } from "../actions";
import { toast } from "sonner";

export function NewLectureModal({ courseId, moduleId }: { courseId: string, moduleId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<LectureSchemaType>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
      moduleId: moduleId,
    },
  });

  function handleOpenChange(open: boolean) {
    if (!pending) {
      setIsOpen(open);
      if (!open) {
        form.reset();
      }
    }
  }

  async function onSubmit(values: LectureSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLecture(values));

      if (error) {
        toast.error("An unexpected error occurred. Please try again");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-center gap-1">
          <Plus className="size-4" />
          Add Lecture
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New Lecture</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Organize your course content into lecture
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
            <FormField 
              control={form.control} 
              name="name" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Lecture Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your course lecture name" 
                      {...field}
                      className="py-5 px-4"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-4 sm:gap-2">
              <Button 
                variant="outline" 
                type="button"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={pending}
                className="min-w-[120px]"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create lecture"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}