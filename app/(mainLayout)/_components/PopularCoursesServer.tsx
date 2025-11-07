import { popularGetCourse } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "./PublicCourseCard";

export default async function PopularCoursesServer() {
  const data = await popularGetCourse();

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-4">
        No popular courses available right now.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}
