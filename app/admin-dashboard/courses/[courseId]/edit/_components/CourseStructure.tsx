'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, FileText, GripVertical, Plus, Trash2 } from "lucide-react";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { id } from "zod/v4/locales";
import { reorderLecture, reorderModules } from "../actions";
import { NewModuleModal } from "./NewModuleModal";
import { NewLectureModal } from "./NewLectureModal";
import { DeleteLecture } from "./DeleteLecture";

interface iAppProps {
    data: AdminCourseSingularType;
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
    // console.log(items);

    useEffect(() => {
        setItems((prevItems) => {
            const updatedItems = data.module.map((module) => ({
                id: module.id,
                title: module.title,
                order: module.position,
                isOpen: prevItems.find((item) => item.id === module.id)?.isOpen ?? true,
                lecture: module.lecture.map((lecture) => ({
                    id: lecture.id,
                    title: lecture.title,
                    order: lecture.position,
                })),
            })) || [];

            return updatedItems;
        });
    }, [data]);

    function SortableItem({ id, children, data, className }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id, data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={cn(className, isDragging ? "opacity-70 ring-2 ring-primary z-50" : "")}
            >
                {children(listeners)}
            </div>
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as 'module' | 'lecture';
        const overType = over.data.current?.type as 'module' | 'lecture';
        const courseId = data.id;

        if (activeType === 'module') {
            let targetModuleId = overType === 'module' ? overId : over.data.current?.moduleId;

            if (!targetModuleId) {
                toast.error("Could not determine module for reordering");
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === targetModuleId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not find module for reordering");
                return;
            }

            const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
                ...item,
                order: index + 1,
            }));

            const previousItems = [...items];

            setItems(reordered);

            if (courseId) {
                const moduleToUpdate = reordered.map((module) => ({
                    id: module.id,
                    position: module.order,
                }));

                const reorderPromise = () => reorderModules(courseId, moduleToUpdate);

                toast.promise(reorderPromise(), {
                    loading: "Reordering loading...",
                    success: (result) => {
                        if (result.status === "success") return result.message;
                        throw new Error(result.message);
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder module"
                    }
                });
            }
        }

        if (activeType === 'lecture' && overType === 'lecture') {
            const moduleId = active.data.current?.moduleId;
            const overModuleId = over.data.current?.moduleId;

            if (!moduleId || moduleId !== overModuleId) {
                toast.error("Lecture reordering between different modules is not allowed");
                return;
            }

            const moduleIndex = items.findIndex((module) => module.id === moduleId);
            if (moduleIndex === -1) {
                toast.error("Could not find module for lecture");
                return;
            }

            const moduleToUpdate = items[moduleIndex];
            const oldLectureIndex = moduleToUpdate.lecture.findIndex((lecture) => lecture.id === activeId);
            const newLectureIndex = moduleToUpdate.lecture.findIndex((lecture) => lecture.id === overId);

            if (oldLectureIndex === -1 || newLectureIndex === -1) {
                toast.error("Could not find lecture for reordering");
                return;
            }

            const reorderedLecture = arrayMove(moduleToUpdate.lecture, oldLectureIndex, newLectureIndex).map((lecture, index) => ({
                ...lecture,
                order: index + 1,
            }));

            const newItems = [...items];
            newItems[moduleIndex] = {
                ...moduleToUpdate,
                lecture: reorderedLecture,
            };

            const previousItems = [...items];

            setItems(newItems);

            if (courseId) {
                const lectureToUpdate = reorderedLecture.map((lecture) => ({
                    id: lecture.id,
                    position: lecture.order,
                }));

                const reorderLecturesPromise = () => reorderLecture(moduleId, lectureToUpdate, courseId);

                toast.promise(reorderLecturesPromise(), {
                    loading: "Reordering loading...",
                    success: (result) => {
                        if (result.status === "success") return result.message;
                        throw new Error(result.message);
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder lecture"
                    }
                })
            }

            return;
        }
    }

    function toggleModule(moduleId: string) {
        setItems((prev) =>
            prev.map((module) =>
                module.id === moduleId ? { ...module, isOpen: !module.isOpen } : module
            )
        );
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 10 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                    <CardTitle className="text-lg font-semibold">
                        Structure Module and Lecture
                    </CardTitle>
                    <NewModuleModal courseId={data.id}/>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableItem id={item.id} data={{ type: "module" }} key={item.id}>
                                    {(listeners) => (
                                        <div className="border rounded-lg overflow-hidden">
                                            <Collapsible open={item.isOpen} onOpenChange={() => toggleModule(item.id)}>
                                                <div className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" className="cursor-grab hover:bg-background" {...listeners}>
                                                            <GripVertical className="size-4" />
                                                        </Button>

                                                        <CollapsibleTrigger asChild>
                                                            <Button size="icon" variant="ghost" title="Toggle">
                                                                {item.isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                                            </Button>
                                                        </CollapsibleTrigger>

                                                        <p className="font-medium cursor-pointer hover:text-primary">{item.title}</p>

                                                        <Badge variant="secondary" className="ml-2">
                                                            {item.lecture.length} lecture{item.lecture.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="icon" title="Delete Module">
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <CollapsibleContent className="bg-background">
                                                    <div className="py-2">
                                                        <SortableContext items={item.lecture.map(l => l.id)} strategy={verticalListSortingStrategy}>
                                                            {item.lecture.map((lecture) => (
                                                                <SortableItem key={lecture.id} id={lecture.id} data={{ type: "lecture", moduleId: item.id }} className="hover:bg-accent/50 transition-colors">
                                                                    {(lectureListeners) => (
                                                                        <div className="flex items-center justify-between py-2 px-4">
                                                                            <div className="flex items-center px-4 gap-2">
                                                                                <Button variant="ghost" size="icon" className="cursor-grab" {...lectureListeners}>
                                                                                    <GripVertical className="size-4 opacity-70" />
                                                                                </Button>
                                                                                <FileText className="size-4 text-primary" />
                                                                                <Link href={`/admin-dashboard/courses/${data.id}/${item.id}/${lecture.id}`} className="text-sm hover:underline">
                                                                                    {lecture.title}
                                                                                </Link>
                                                                            </div>

                                                                            <DeleteLecture/>
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>

                                                        <NewLectureModal 
                                                            moduleId={item.id} courseId={data.id} 
                                                        />
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
                {/* <NewModuleModal courseId={data.id}/> */}
            </Card>
        </DndContext>
    );
}
