'use client';

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  isDeleting: boolean;
  key?: string;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video" | "pdf" | "doc";
}

export function Uploader() {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: 'image'
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // Simulated upload process
      // Replace this with your actual upload logic
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          setFileState(prev => {
            const newProgress = prev.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...prev,
                progress: 100,
                uploading: false,
                key: `file-${Date.now()}`,
              };
            }
            return {
              ...prev,
              progress: newProgress
            };
          });
        }, 200);
      });

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during upload");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image"
      });

      uploadFile(file);
    }
  }, [fileState.objectUrl]);

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      // Simulate delete process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: "image",
        id: null,
        isDeleting: false,
        key: undefined,
      });

      toast.success("File removed successfully!");

    } catch (error) {
      console.error(error);
      toast.error("Error removing file. Please try again");

      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === 'too-many-files');
      const fileBig = fileRejection.find((rejection) => rejection.errors[0].code === "file-too-large");

      if (fileBig) {
        toast.error("File size is too large (max 5MB)");
      }

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: rejectedFile,
  });

  function renderContent() {
    if (fileState.uploading && fileState.file) {
      return <RenderUploadingState file={fileState.file} progress={fileState.progress} />;
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl && fileState.file) {
      return (
        <RenderUploadedState 
          previewUrl={fileState.objectUrl} 
          handleRemoveFile={handleRemoveFile} 
          isDeleting={fileState.isDeleting}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <div className="w-full">
      <Card {...getRootProps()} className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 overflow-hidden",
        isDragActive ? "border-primary bg-primary/10 border-solid" : 
        fileState.error ? "border-destructive bg-destructive/10" :
        "border-border hover:border-primary"
      )}>
        <CardContent className="flex items-center justify-center h-full w-full p-0">
          <input {...getInputProps()} />
          {renderContent()}
        </CardContent>
      </Card>
      
      {fileState.file && !fileState.uploading && !fileState.error && (
        <div className="mt-3 text-sm text-muted-foreground truncate">
          <span className="font-medium">Selected:</span> {fileState.file.name}
        </div>
      )}
    </div>
  );
}