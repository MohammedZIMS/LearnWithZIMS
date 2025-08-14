import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { School, TimerIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);

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


  return (
    <div className="w-full max-w-sm">
      <Card className="relative overflow-hidden rounded-xl dark:bg-gray-900 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 py-0 gap-0">
        
        {/* Badge */}
        <Badge className="absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded-md">
          {data.level}
        </Badge>

        {/* Thumbnail */}
        <div className="relative w-full h-48">
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail for ${data.title}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <CardContent className="p-5 space-y-4">
          {/* Title */}
          <Link
            className="block font-semibold text-lg line-clamp-2 hover:text-primary transition-colors"
            href={`/courses/${data.slug}`}
          >
            {data.title}
          </Link>

          {/* Duration & Category */}
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-2">
              <TimerIcon className="text-primary size-5 p-1 rounded-md bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.duration}h</p>
            </div>

            <div className="flex items-center gap-x-2">
              <School className="text-primary size-5 p-1 rounded-md bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.category}</p>
            </div>

          {/* Rating */}
          <div className="flex items-center text-yellow-500">
            {renderStars(data.averageRating)}
            <span className="ml-1 text-sm text-gray-500">
              ({data.averageRating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {data.smallDescription}
        </p>
        
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <span className="text-xl font-bold text-blue-600">
              {data.price === 0 ? "Free" : `$${data.price}`}
            </span>
            <p className="text-xs text-gray-500">Price</p>
          </div>

          <Link
            className={buttonVariants({ variant: "default" })}
            href={`/courses/${data.slug}`}
          >
            Learn More
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
