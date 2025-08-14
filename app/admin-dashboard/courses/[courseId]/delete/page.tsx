"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

export default function DeleteCourseRoute() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error(
          "An unexpected error occurred while deleting the course. Please try again."
        );
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        router.push("/admin-dashboard/courses");
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }

  return (
    <div className="max-w-lg mx-auto w-full mt-32 px-4">
      <Card className="border-red-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-red-700 mt-3">
            Delete Course
          </CardTitle>
          <CardDescription className="text-gray-600">
            Are you sure you want to delete this course? <br />
            <span className="text-red-500 font-semibold">
              This action cannot be undone.
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-center gap-4 mt-4">
          <Link
            href={"/admin-dashboard/courses"}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>

          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={pending}
            className="flex items-center gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
