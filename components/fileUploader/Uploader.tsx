'use client';

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { resolve } from "path";
import { rejects } from "assert";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    isDeleting: boolean;
    key?: string;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video" | "pdf" | "doc" ;
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
        setFileState((pev) => ({
            ...pev,
            uploading: true,
            progress: 0,
        }));

        try {
            // 1. Get presigned URL
            const presignedResponse = await fetch('/api/s3/upload', {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            if (!presignedResponse.ok) {
                toast.error("Failed to get presigned URL");
                setFileState((pev) => ({
                    ...pev,
                    uploading: true,
                    progress: 0,
                }));

                return;
            }

            const {presignedurl, Key} = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100;

                        setFileState((pev) => ({
                            ...pev,
                            progress: Math.round(percentageCompleted),
                        }));

                    }
                }

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((pev) => ({
                            ...pev,
                            progress: 100,
                            uploading: false,
                            key: Key,
                        }));

                        toast.success("File uploaded successfully!");

                        resolve();
                    } else {
                        reject(new Error("Upload failed ..."))
                    }

                    xhr.onerror = () => {
                        reject(new Error("Upload failed"))
                    };

                };
                xhr.open("PUT", presignedurl);
                xhr.setRequestHeader("Content-type", file.type);
                xhr.send(file);
                
            })
        } catch (error) {
            toast.error("Something went wrong");

            setFileState((pev) => ({
                ...pev,
                progress: 0,
                error: true,
                uploading: false,
            }));
        }
    }

    const onDrop = useCallback((acceptedFile :File[]) => {
        if (acceptedFile.length > 0) {
            const file = acceptedFile[0];
            
            setFileState({
                file: file,
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
        
    },[]);

    function rejectedFile(fileRejection: FileRejection[]){
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === 'too-many-files')

        const fileBig = fileRejection.find(
            (rejection) => rejection.errors[0].code === "file-too-large"
        );

        if(fileBig){
            toast.error("File size is too large")
        }

            if (tooManyFiles) {
                toast.error("too many files selected, max is 1");
            }
        }
    }

    const {getRootProps, getInputProps, isDragAccept} = useDropzone({
        onDrop,
        accept: {"image/*": []},
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5md
        onDropRejected: rejectedFile
    });

    function renderContent() {
        if (fileState.uploading) {
            return <h1>Uplading...</h1>
        }

        if (fileState.error) {
            return <RenderErrorState/>
        }

        if (fileState.objectUrl) {
            return <h1>Upload file</h1>
        }

        return <RenderEmptyState isDragActive={isDragAccept}/>
    }

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragAccept ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">

            <input {...getInputProps()} />
            {renderContent()}
            </CardContent>
        </Card>
    )
}