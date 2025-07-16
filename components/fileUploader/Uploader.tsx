'use client';

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";


export function Uploader() {
    const onDrop = useCallback((acceptedFile :File[]) => {
        console.log(acceptedFile);
        
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
            <RenderErrorState/>
            </CardContent>
        </Card>
    )
}