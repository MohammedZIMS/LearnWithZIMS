"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export function CourseReview({ courseId }: { courseId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/course/${courseId}/reviews`);
      const data = await res.json();
      setReviews(data.reviews);
      setAverage(data.averageRating);
    };
    fetchReviews();
  }, [courseId]);

  const handleSubmit = async () => {
    const res = await fetch(`/api/course/${courseId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    if (res.ok) {
      setComment("");
      setRating(0);
      const updated = await res.json();
      setReviews(updated.reviews);
      setAverage(updated.averageRating);
    }
  };


  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Average Rating Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{average}/5</h2>
        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < Math.round(average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{reviews.length} total reviews</p>
      </div>

      {/* Rating Form */}
      <div className="bg-background p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
        <div className="flex gap-2 mb-4 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(0)}
              className={`w-8 h-8 cursor-pointer transition ${i < (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
                }`}
            />
          ))}
        </div>

        <Textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          className="mt-3 w-full"
          disabled={rating === 0}
        >
          Submit Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Student Reviews</h3>
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
        {reviews.map((rev) => (
          <div key={rev.id} className="border-b pb-3">
            <div className="flex items-center gap-2 mb-1">
              {Array.from({ length: rev.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{rev.comment}</p>
            <p className="text-xs text-gray-500 mt-1">— {rev.user?.name || "Anonymous"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
