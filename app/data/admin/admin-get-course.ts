import 'server-only';
import { requireAdmin } from './require-asmin';

export async function adminGetCourse() {
    await requireAdmin();
}