import { cn } from "@/lib/utils";
import { CloudUpload, Image as ImageIcon, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className={cn(
        "flex items-center justify-center rounded-full bg-muted size-16 transition-colors",
        isDragActive && "bg-primary/10 text-primary"
      )}>
        <CloudUpload className={cn(
          "size-8 text-muted-foreground transition-colors",
          isDragActive && "text-primary"
        )} />
      </div>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          {isDragActive ? "Drop your file here" : "Upload an image"}
        </h3>
        <p className="text-sm text-muted-foreground">
          PNG, JPG, or JPEG (Max: 5MB)
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Click or drag file to this area to upload
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
  { previewUrl, isDeleting, handleRemoveFile } : 
  { previewUrl: string; isDeleting: boolean; handleRemoveFile: () => void }
) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full h-[180px]">
        <Image 
          src={previewUrl} 
          alt="Uploaded file" 
          fill
          className="object-contain"
        />
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