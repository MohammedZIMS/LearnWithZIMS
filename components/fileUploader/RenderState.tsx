import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";

export function RenderEmptyState({isDragActive}: {isDragActive: boolean}){
    return(
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center rounded-full bg-muted size-14">
                <CloudUploadIcon className={cn(
                    "size-10 mb-3 text-muted-foreground",
                    isDragActive && "text-primary"
                )}/>
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Upload an image or <samp className="text-primary font-bold">drag & drop</samp>
            </p>
        </div>
    )
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center rounded-full bg-destructive/30 size-14">
                <ImageIcon className={cn("size-10 text-destructive")}/>
            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-xs mt-1 text-muted-foreground">Something went worng</p>
            <p className="text-xl mt-3 text-muted-foreground">Click or drag file to retry</p>
        </div>
    )
}