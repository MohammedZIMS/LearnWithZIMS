import { cn } from "@/lib/utils";
import { CloudUpload, Image as ImageIcon, Video, Loader2, X, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface FileTypeProps {
  fileType?: "image" | "video" | "pdf" | "doc";
}


export function RenderEmptyState({ 
  isDragActive,
  fileType = "image"
}: { 
  isDragActive: boolean 
} & FileTypeProps) {
  // Get appropriate icon based on file type
  const getIcon = () => {
    switch (fileType) {
      case 'video': return <Video className={cn("size-8 text-muted-foreground transition-colors", isDragActive && "text-primary")} />;
      case 'pdf': return <FileText className={cn("size-8 text-muted-foreground transition-colors", isDragActive && "text-primary")} />;
      case 'doc': return <FileText className={cn("size-8 text-muted-foreground transition-colors", isDragActive && "text-primary")} />;
      default: return <CloudUpload className={cn("size-8 text-muted-foreground transition-colors", isDragActive && "text-primary")} />;
    }
  };

  // Get file type label
  const getLabel = () => {
    switch (fileType) {
      case 'video': return "video";
      case 'pdf': return "PDF";
      case 'doc': return "document";
      default: return "image";
    }
  };

  // Get file extensions
  const getExtensions = () => {
    switch (fileType) {
      case 'video': return "MP4, WebM, MOV";
      case 'pdf': return "PDF";
      case 'doc': return "DOC, DOCX";
      default: return "PNG, JPG, JPEG";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className={cn(
        "flex items-center justify-center rounded-full bg-muted p-4 size-24 transition-all duration-300",
        isDragActive && "ring-4 ring-primary/30 scale-105 bg-primary/10 text-primary"
      )}>
        {getIcon()}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">
          {isDragActive ? "Drop to upload" : `Upload a ${getLabel()}`}
        </h3>
        <p className="text-muted-foreground">
          {getExtensions()} (Max: {fileType === 'image' ? '5MB' : '5GB'})
        </p>
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">
        Click or drag file to this area
      </p>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex items-center justify-center rounded-full bg-destructive/10 text-destructive size-16">
        <AlertCircle className="size-8" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          Upload Failed
        </h3>
        <p className="text-sm text-muted-foreground">
          Something went wrong during upload
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Click or drag file to retry
      </p>
    </div>
  );
}

export function RenderUploadedState(
  { previewUrl, isDeleting, handleRemoveFile, fileType } : 
  { previewUrl: string; isDeleting: boolean; handleRemoveFile: () => void; fileType: "image" | "video" | "pdf" | "doc"; }
) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative group w-full h-full flex items-center justify-center">
        {fileType === 'video' ? (
          <>
          <video 
            src={previewUrl} 
            controls 
            className="rounded-md h-full w-full" 
            />
            
          </>
        ) : fileType === 'image' ? (
          <>
          <Image 
            src={previewUrl} 
            alt="Uploaded file" 
            fill
            className="object-contain"
            />
          </>
        ) : (
          <>
          <FileText className="size-16 text-primary" />
            <span className="mt-3 text-sm font-medium max-w-[200px] truncate">
              {previewUrl.split('/').pop()}
            </span>
          </>
        )
        }
        <div className="absolute top-0 right-0 z-10">
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full size-8"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin"/>
            ) : (
              <X className="size-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
          <CheckCircle2 className="size-4" />
          <span>Uploaded successfully</span>
        </div>
      </div>
    </div>
  );
}

export function RenderUploadingState({progress, file}: {progress: number, file: File}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs mx-auto">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <Loader2 className="size-6 text-primary animate-spin" />
      </div>
      
      <div className="w-full">
        <div className="flex justify-between text-sm font-medium text-foreground mb-1">
          <span>Uploading...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2 truncate">
          {file.name}
        </p>
      </div>
    </div>
  );
}