"use client";

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
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
  value?: string;
  onChange?: (value?: string) => void;
  fileTypeAccepted: "image" | "video" | "pdf" | "doc";
}

export function Uploader({ onChange, value, fileTypeAccepted }: iAppProps) {
  const fileUrl = useConstructUrl(value || "");
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));

      try {
        const res = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === "image",
          }),
        });

        if (!res.ok) throw new Error("Presigned URL fetch failed");

        const { presignedurl, Key } = await res.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setFileState((prev) => ({
                ...prev,
                progress: Math.round((event.loaded / event.total) * 100),
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
              toast.success("File uploaded successfully");
              onChange?.(Key);
              resolve();
            } else reject(new Error("Upload failed"));
          };

          xhr.onerror = () => reject(new Error("Upload failed"));

          xhr.open("PUT", presignedurl);
          xhr.setRequestHeader("Content-type", file.type);
          xhr.send(file);
        });
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
        setFileState((prev) => ({ ...prev, error: true, uploading: false, progress: 0 }));
      }
    },
    [fileTypeAccepted, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");
      setFileState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: fileTypeAccepted,
        key: undefined,
      });

      uploadFile(file);
    },
    [fileState.objectUrl, uploadFile, fileTypeAccepted, onChange]
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || (!fileState.objectUrl && !fileState.key && !value)) return;

    try {
      setFileState((prev) => ({ ...prev, isDeleting: true }));

      const res = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ key: fileState.key || value }),
      });

      if (!res.ok) throw new Error("Delete failed");

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
        key: undefined,
      });

      onChange?.(undefined);
      toast.success("File removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error removing file");
      setFileState((prev) => ({ ...prev, isDeleting: false, error: true }));
    }
  }

  function rejectedFile(rejected: FileRejection[]) {
    const err = rejected[0]?.errors[0]?.code;
    if (err === "file-too-large") toast.error("Max file size is 5MB");
    if (err === "too-many-files") toast.error("Only one file allowed");
  }

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video"
        ? { "video/*": [] }
        : fileTypeAccepted === "image"
        ? { "image/*": [] }
        : fileTypeAccepted === "pdf"
        ? { "application/pdf": [] }
        : {
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
          },
    maxFiles: 1,
    maxSize: fileTypeAccepted === 'image' ? 5 * 1024 * 1024 : 5000 * 1024 * 1024,
    onDropRejected: rejectedFile,
  });

  function renderContent() {
    if (fileState.uploading) return <RenderUploadingState file={fileState.file!} progress={fileState.progress} />;
    if (fileState.error) return <RenderErrorState />;
    if (fileState.objectUrl || value) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl || value!}
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          fileType={fileState.fileType}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragAccept} fileType={fileTypeAccepted} />;
  }

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
