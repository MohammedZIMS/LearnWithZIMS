import { type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  Strikethrough,
  UndoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface iAppProps {
  editor: Editor | null;
}

export function Menubar({ editor }: iAppProps) {
  if (!editor) return null;

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {[
            { icon: <Bold />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), label: "Bold" },
            { icon: <Italic />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), label: "Italic" },
            { icon: <Strikethrough />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), label: "Strike" },
            { icon: <Heading1Icon />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }), label: "Heading 1" },
            { icon: <Heading2Icon />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), label: "Heading 2" },
            { icon: <Heading3Icon />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), label: "Heading 3" },
            { icon: <ListIcon />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), label: "Bullet List" },
            { icon: <ListOrderedIcon />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), label: "Ordered List" },
          ].map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={item.active}
                  onPressedChange={item.action}
                  className={cn(item.active && "bg-muted text-muted-foreground")}
                >
                  {item.icon}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="w-px h-6 bg-border mx-2"></div>

        <div className="flex flex-wrap gap-1">
          {[
            { icon: <AlignLeftIcon />, align: "left", label: "Align Left" },
            { icon: <AlignCenterIcon />, align: "center", label: "Align Center" },
            { icon: <AlignRightIcon />, align: "right", label: "Align Right" },
          ].map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: item.align })}
                  onPressedChange={() => editor.chain().focus().setTextAlign(item.align).run()}
                  className={cn(editor.isActive({ textAlign: item.align }) && "bg-muted text-muted-foreground")}
                >
                  {item.icon}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="w-px h-6 bg-border mx-2"></div>

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                 type="button" 
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <UndoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                 type="button" 
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <RedoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
