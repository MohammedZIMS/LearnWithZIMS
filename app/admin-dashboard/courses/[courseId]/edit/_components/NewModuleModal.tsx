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
import { moduleSchema, ModuleSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createModule } from "../actions";
import { toast } from "sonner";

export function NewModuleModal({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<ModuleSchemaType>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
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

  async function onSubmit(values: ModuleSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createModule(values));

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
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer">
          <Plus className="size-4" />
          Add Module
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New Module</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Organize your course content into modules
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
            <FormField 
              control={form.control} 
              name="name" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Module Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your course module name" 
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
                  "Create Module"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}