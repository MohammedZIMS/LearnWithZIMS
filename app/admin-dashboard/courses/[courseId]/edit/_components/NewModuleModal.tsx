import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { moduleSchema, ModuleSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
        setIsOpen(open);
    }

    async function onSubmit(values: ModuleSchemaType) {
        startTransition(async () => {
            
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Plus className="size-4" />
                    Add Module
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Create new Module</DialogTitle>
                <DialogDescription>
                    What would you like to name your course module?
                </DialogDescription>

                <Form {...form}>
                    <form className="space-y-8">
                        <FormField 
                            control={form.control} 
                            name="name" 
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your course module name" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button className="dark:text-white" type="submit">
                        Create Module
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}