import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { env } from "@/lib/env";
import { IconBook, IconChartBar, IconChevronDown, IconChevronRight, IconPlayerPlay } from "@tabler/icons-react";
import { TimerIcon, School, Star, BookOpen, Calendar } from "lucide-react";
import Image from "next/image";
import { checkIfCourseBouht } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import { EnrollmentButton } from "./_components/EnrollmentButton";

type Params = Promise<{ slug: string }>

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const isEnrolled = await checkIfCourseBouht(course.id);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={
          i < fullStars || (hasHalfStar && i === fullStars)
            ? "currentColor"
            : "none"
        }
        className={
          i < fullStars || (hasHalfStar && i === fullStars)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      />
    ));
  };

  // Construct the image URL
  const imageUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`;

  return (
    <div className="max-w-7xl mx-auto mb-32">
      {/* Gradient Header */}
      <div
        className="relative min-h-[400px] flex flex-col justify-center pb-3"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r dark:from-gray-900/90 dark:to-blue-900/90 from-blue-600/80 to-indigo-700/80" />

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-white text-blue-600 hover:bg-white/90">
              {course.level}
            </Badge>
            <Badge className="bg-white/20 text-white hover:bg-white/30">
              {course.category}
            </Badge>
            <div className="flex items-center text-yellow-300 ml-auto">
              {renderStars(course.averageRating)}
              <span className="ml-2 text-white">
                {course.averageRating.toFixed(1)} ({course.reviewCount} reviews)
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {course.title}
          </h1>

          <p className="text-blue-100 text-lg max-w-3xl">
            {course.smallDescription}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 -mt-8">
        {/* Left Column */}
        <div className="order-1 lg:col-span-2">

          {/* Course Description */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-600" size={20} />
              Course Description
            </h2>

            <div>
              <RenderDescription json={JSON.parse(course.description)} />
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                  <IconBook className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Course Curriculum</h2>
              </div>
              
              <div className="text-muted-foreground bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                {course.module.length} Modules •{" "}
                {course.module.reduce((t, m) => t + m.lecture.length, 0)} Lectures
              </div>
            </div>

            <div className="space-y-4">
              {course.module.map((module, index) => (
                <Collapsible key={module.id} defaultOpen={index === 0}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden gap-0 p-0">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-5 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lecture.length} Lecture
                              {module.lecture.length > 1 && "s"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{module.lecture.length} Lecture</Badge>
                          <IconChevronDown className="size-5 text-muted-foreground hidden data-[state=open]:block" />
                          <IconChevronRight className="size-5 text-muted-foreground data-[state=open]:hidden" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="bg-gray-50 dark:bg-gray-800/50">
                        <div className="p-5 space-y-3">
                          {module.lecture.map((lecture, lectureIndex) => (
                            <div
                              key={lecture.id}
                              className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-900 border hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-center size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <IconPlayerPlay className="size-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{lecture.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Lecture {lectureIndex + 1}
                                </p>
                              </div>
                              {/* {lectureIndex === 0 && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Preview
                                </span>
                              )} */}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Course Info */}
        <div className="order-2 lg:col-span-1">
          <Card className="sticky top-24 shadow-lg gap-0 py-0">
            <CardHeader className="relative aspect-video w-full overflow-hidden rounded-xl shadow-xl">
              <Image
                src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`}
                alt={`${course.title} course cover image`}
                fill
                priority
                className="object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold">Price:</span>
                <div>
                  {course.price === 0 ? (
                    <span className="text-2xl font-bold text-green-600">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(course.price)}
                      </span>
                      <p className="text-sm text-gray-500">One-time payment</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-8">
                {course.price === 0 ? (
                  <Link
                    href={`/dashboard/${slug}`}
                    className="w-full block py-3 rounded-lg bg-green-600 text-white font-semibold text-center hover:bg-green-700 transition"
                  >
                    Start Learning
                  </Link>
                ) : isEnrolled ? (
                  <Link
                    href={`/dashboard/${slug}`}
                    className="w-full block py-3 rounded-lg bg-green-500 text-white font-semibold text-center hover:bg-green-600/90 transition"
                  >
                    Continue Course
                  </Link>
                ) : (
                  <EnrollmentButton courseId={course.id} />
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">What you will get:</h4>
                <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <TimerIcon className="text-blue-600 dark:text-blue-400 size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{course.duration} hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <IconChartBar className="text-blue-600 dark:text-blue-400 size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty Level</p>
                    <p className="font-medium">{course.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <School className="text-blue-600 dark:text-blue-400 size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{course.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <IconBook className="text-blue-600 dark:text-blue-400 size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Lectures</p>
                    <p className="font-medium">
                      {course.module.reduce(
                        (total, module) => total + module.lecture.length,
                        0
                      ) || 0}{" "} 
                      Lectures
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Calendar className="text-blue-600 dark:text-blue-400 size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(course.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3">This course includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Access on mobile and desktop</span>
                  </li>
                </ul>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}

// Badge component for the header
function Badge({ 
  children, 
  className,
  variant = "default",
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" }) {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
  
  const variantClasses = variant === "secondary" 
    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}