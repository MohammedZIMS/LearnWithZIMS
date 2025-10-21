"use client";

import { LectureContentType } from "@/app/data/course/get-lecture-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle, FileText, Download } from "lucide-react";

interface iAppProps {
  data: LectureContentType;
}

export function CourseContent({ data }: iAppProps) {
  function LectureViewer({
    thumbnailKey,
    videoUrl,
    documentUrl,
  }: {
    thumbnailKey?: string;
    videoUrl?: string;
    documentUrl?: string;
  }) {
    const constructedVideoUrl = videoUrl ? useConstructUrl(videoUrl) : null;
    const constructedThumbnail = thumbnailKey ? useConstructUrl(thumbnailKey) : null;
    const constructedDocUrl = documentUrl ? useConstructUrl(documentUrl) : null;

    // Case 1: Video lecture
    if (constructedVideoUrl) {
      return (
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
          <video
            className="w-full h-full object-cover"
            controls
            poster={constructedThumbnail || undefined}
          >
            <source src={constructedVideoUrl} type="video/mp4" />
            <source src={constructedVideoUrl} type="video/webm" />
            <source src={constructedVideoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Case 2: PDF or document lecture
    if (constructedDocUrl) {
      return (
        <div className="flex flex-col items-center justify-center text-center bg-muted rounded-2xl p-10 shadow-sm">
          <FileText className="size-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">Document Lecture</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This lecture contains a document or PDF file.
          </p>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <a href={constructedDocUrl} target="_blank" rel="noopener noreferrer">
              <Download className="size-4" />
              Open / Download Document
            </a>
          </Button>
        </div>
      );
    }

    // Case 3: No content yet
    return (
      <div className="aspect-video bg-muted rounded-2xl flex flex-col items-center justify-center shadow-inner">
        {constructedThumbnail ? (
          <img
            src={constructedThumbnail}
            alt="Lecture thumbnail"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <>
            <BookIcon className="size-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">This lecture does not have content yet.</p>
          </>
        )}
      </div>
    );
  }

  // Safe JSON parsing for description
  let parsedDescription = null;
  try {
    parsedDescription = data.description ? JSON.parse(data.description) : null;
  } catch {
    parsedDescription = null;
  }

  return (
    <div className="flex flex-col h-full bg-background px-6 pb-10 pt-4 rounded-lg">
      {/* --- Lecture Viewer Section --- */}
      <LectureViewer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoUrl={data.videoUrl ?? ""}
        documentUrl={data.documentUrl ?? ""}
      />

      {/* --- Mark Complete Section --- */}
      <div className="py-5 border-b mt-6 flex justify-between items-center">
        <Button variant="outline" className="flex items-center gap-2">
          <CheckCircle className="size-4 text-green-500" />
          <span>Mark as Complete</span>
        </Button>
        <p className="text-sm text-muted-foreground">
          Position: <span className="font-medium">{data.position}</span>
        </p>
      </div>

      {/* --- Description Section --- */}
      <div className="py-6 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">{data.title}</h1>
        {parsedDescription ? (
          <RenderDescription json={parsedDescription} />
        ) : (
          <p className="text-muted-foreground text-sm">No description available.</p>
        )}
      </div>
    </div>
  );
}
