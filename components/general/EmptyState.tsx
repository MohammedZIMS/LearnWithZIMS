import { PlusCircle, File, FileText, Video, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  iconType?: "default" | "file" | "image" | "video";
}

export function EmptyState({ title, description, buttonText, href, iconType = "default" }: iAppProps) {
  // Get appropriate icon based on type
  const getIcon = () => {
    switch (iconType) {
      case 'file': return <FileText className="size-10" />;
      case 'image': return <ImageIcon className="size-10" />;
      case 'video': return <Video className="size-10" />;
      default: return <File className="size-10" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50 max-w-md mx-auto bg-background shadow-sm">
      <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 mb-6">
        <div className="bg-gradient-to-br from-primary to-purple-600 p-3 rounded-full">
          {getIcon()}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h2>
        
        <p className="text-muted-foreground text-lg leading-relaxed max-w-prose">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "mt-8 px-8 py-6 text-base font-medium rounded-lg group transition-all duration-300 shadow-md hover:shadow-lg"
        )}
      >
        <PlusCircle className="size-5 mr-3 transition-transform group-hover:scale-110" />
        <span className="font-semibold tracking-wide">{buttonText}</span>
      </Link>
      
      <div className="mt-8 w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 rounded-full" />
    </div>
  );
}