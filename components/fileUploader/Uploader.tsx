"use client";

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";

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

interface iAppProps {
  value?: string; // S3 key or URL for controlled component
  onChange?: (value?: string) => void; // Emits S3 key after upload or undefined after delete
}

export function Uploader({ onChange, value }: iAppProps) {
  const fileUrl = useConstructUrl(value || "");
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key: value,
    objectUrl: fileUrl,
  });

  // Handle file upload with presigned URL
  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { presignedurl, Key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percent),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: Key,
            }));
            toast.success("File uploaded successfully!");

            onChange?.(Key); // Emit uploaded file key
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.open("PUT", presignedurl);
        xhr.setRequestHeader("Content-type", file.type);
        xhr.send(file);
      });
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

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // Reset controlled value first
      onChange?.("");

      setFileState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
        key: undefined,
      });

      uploadFile(file);
    }
  }, [fileState.objectUrl, onChange]);

  // Handle file delete from S3
  async function handleRemoveFile() {
    if (fileState.isDeleting || (!fileState.objectUrl && !fileState.key && !value)) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          key: fileState.key || value,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // Reset state
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

      onChange?.(undefined);
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

  // Handle rejected files
  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find((r) => r.errors[0].code === "too-many-files");
      const fileBig = fileRejection.find((r) => r.errors[0].code === "file-too-large");

      if (fileBig) toast.error("File size is too large (max 5MB)");
      if (tooManyFiles) toast.error("Too many files selected, max is 1");
    }
  }

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFile,
  });

  // Render appropriate state
  function renderContent() {
    if (fileState.uploading) {
      return <RenderUploadingState file={fileState.file as File} progress={fileState.progress} />;
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl || value) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl || value!}
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragAccept} />;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragAccept ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>

      <div className="mt-3 text-sm text-muted-foreground truncate mb-2 px-4 pb-4">
        <span className="font-medium">Selected:</span>{" "}
        {fileState.file?.name || (value ? value.split("/").pop() : "No file selected")}
      </div>
    </Card>
  );
}
