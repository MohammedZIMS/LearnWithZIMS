"use client";

import { UploadCloud, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function ImageUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      simulateUpload();
    }
  }, []);

  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === 'too-many-files')

      const fileBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileBig) {
        toast.error("File size is too large")
      }

      if (tooManyFiles) {
        toast.error("too many files selected, max is 1");
      }
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: rejectedFile,
  });

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl cursor-pointer transition-all
          ${isDragActive
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : preview
              ? 'border-gray-200 dark:border-gray-700'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary'
          }
          ${isUploading ? 'opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} className="hidden" />

        <div className="flex flex-col items-center justify-center p-6 text-center">
          {isUploading ? (
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploading...
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Processing your image...
              </p>
            </div>
          ) : preview ? (
            <div className="relative w-full">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full size-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  type="button"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={preview}
                    className="w-full max-h-64 rounded-lg object-contain border"
                    alt="Preview"
                  />
                  {/* <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle2 className="size-5" /> 
                  </div> */}
                </div>

                <div className="mt-4 text-left w-full">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-5 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
                      {file?.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {file ? (file.size / 1024).toFixed(1) + ' KB' : ''}
                  </p>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Click to replace or drag & drop a new image
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className={`size-10 mb-3 ${isDragActive ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isDragActive ? 'Drop your image here' : 'Upload an image'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG, GIF, WEBP (Max: 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
