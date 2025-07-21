'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, FileText, GripVertical, Plus, Trash2 } from "lucide-react";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface iAppProps {
    data: AdminCourseSingularType,
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: 'module' | 'lecture';
        moduleId?: string;
    }
}

export function CourseStructure({ data }: iAppProps) {
    const initialItems = data.module.map((module) => ({
        id: module.id,
        title: module.title,
        order: module.position,
        isOpen: true,
        lecture: module.lecture.map((lecture) => ({
            id: lecture.id,
            title: lecture.title,
            order: lecture.position,
        })),
    })) || [];

    const [items, setItems] = useState(initialItems);

    function SortableItem({ id, children, data, className }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: id, data: data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={cn(
                    className,
                    isDragging ? "opacity-70 ring-2 ring-primary z-50" : ""
                )}
            >
                {children(listeners)}
            </div>
        );
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((prevItems) => {
                const oldIndex = prevItems.findIndex(item => item.id === active.id);
                const newIndex = prevItems.findIndex(item => item.id === over.id);

                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }
    }

    function toggleModule(moduleId: string) {
        setItems((prevItems) =>
            prevItems.map((module) =>
                module.id === moduleId
                    ? { ...module, isOpen: !module.isOpen }
                    : module
            )
        );
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                    <CardTitle className="text-lg font-semibold">Structure</CardTitle>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Plus className="size-4" />
                        Add Module
                    </Button>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableItem id={item.id} data={{ type: "module" }} key={item.id}>
                                    {(listeners) => (
                                        <div className="border rounded-lg overflow-hidden">
                                            <Collapsible open={item.isOpen} onOpenChange={() => toggleModule(item.id)}>
                                                <div className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            variant={"ghost"} 
                                                            size="icon"
                                                            className="cursor-grab hover:bg-background"
                                                            {...listeners}
                                                        >
                                                            <GripVertical className="size-4" />
                                                        </Button>

                                                        <CollapsibleTrigger asChild>
                                                            <Button
                                                                className="flex items-center"
                                                                size={"icon"}
                                                                variant={'ghost'}
                                                                title="Toggle"
                                                            >
                                                                {item.isOpen ? (
                                                                    <ChevronDown className="size-4" />
                                                                ) : (
                                                                    <ChevronRight className="size-4" />
                                                                )}
                                                            </Button>
                                                        </CollapsibleTrigger>

                                                        <p className="font-medium cursor-pointer hover:text-primary">
                                                            {item.title}
                                                        </p>
                                                        
                                                        <Badge variant="secondary" className="ml-2">
                                                            {item.lecture.length} lecture{item.lecture.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button variant={"ghost"} size="icon" title="Add lecture">
                                                            <Plus className="size-4"/>
                                                        </Button>
                                                        <Button variant={"outline"} size="icon" title="Deleted Module">
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <CollapsibleContent className="bg-background">
                                                    <div className="py-2">
                                                        <SortableContext items={item.lecture.map(lecture => lecture.id)} strategy={verticalListSortingStrategy}>
                                                            {item.lecture.map((lecture) => (
                                                                <SortableItem 
                                                                    key={lecture.id} 
                                                                    id={lecture.id} 
                                                                    data={{ type: "lecture", moduleId: item.id }}
                                                                    className="hover:bg-accent/50 transition-colors"
                                                                >
                                                                    {(lectureListeners) => (
                                                                        <div className="flex items-center justify-between py-2 px-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon" 
                                                                                    className="cursor-grab"
                                                                                    {...lectureListeners}
                                                                                >
                                                                                    <GripVertical className="size-4 opacity-70" />
                                                                                </Button>
                                                                                <FileText className="size-4 text-primary" />
                                                                                <Link 
                                                                                    href={`/admin-dashboard/courses/${data.id}/${item.id}/${lecture.id}`}
                                                                                    className="text-sm hover:underline"
                                                                                >
                                                                                    {lecture.title}
                                                                                </Link>
                                                                            </div>

                                                                            <Button variant="outline" size="icon" title="Deleted lecture">
                                                                                <Trash2 className="size-4 text-destructive" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>

                                                        <Button 
                                                            className="w-full mt-1 border-t rounded-none border-0 bg-background hover:bg-accent" 
                                                            variant={"ghost"}
                                                            size="sm"
                                                        >
                                                            <Plus className="size-4 mr-2" />
                                                            Add Lecture
                                                        </Button>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    )}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </div>
                </CardContent>
            </Card>
        </DndContext>
    );
}