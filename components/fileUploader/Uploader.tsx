'use client';

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
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

    function uploadFile() {
        setFileState((pev) => ({
            ...pev,
            uploading: true,
            progress: 0,
        }));

        try {
            
        } catch (error) {
            
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
            })
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

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragAccept ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">

            <input {...getInputProps()} />
            <RenderEmptyState isDragActive={isDragAccept}/>
            {/* <RenderErrorState/> */}
            </CardContent>
        </Card>
    )
}