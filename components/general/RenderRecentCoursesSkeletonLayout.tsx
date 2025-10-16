"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="border rounded-xl p-4 space-y-3 bg-card"
        >
          <Skeleton className="h-5 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-full" /> {/* Description */}
          <Skeleton className="h-4 w-5/6" /> {/* More description */}
          <div className="flex justify-between pt-2">
            <Skeleton className="h-6 w-16" /> {/* Level or price */}
            <Skeleton className="h-6 w-24" /> {/* Status or button */}
          </div>
        </div>
      ))}
    </div>
  )
}
