"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignout() {
    const router = useRouter();

    const handleSignout = async function signout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Signout successfuly");
                },
                onError: () => {
                    toast.error("Failed to signout");
                }
            },
        });
    }
    return handleSignout
}
