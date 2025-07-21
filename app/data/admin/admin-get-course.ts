import 'server-only';

import { requireAdmin } from './require-asmin';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function adminGetCourse(id: string) {
    await requireAdmin();

    const data = await prisma.course.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            smallDescription: true,
            category: true,
            module: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lecture: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            position: true,
                            videoUrl: true,
                            documentUrl: true,
                            
                        }
                    }
                }
            }
        },
    });

    if (!data) {
        return notFound(); 
    }

    return data;
}

export type AdminCourseSingularType =Awaited<ReturnType<typeof adminGetCourse>>