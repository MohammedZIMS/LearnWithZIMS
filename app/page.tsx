"use client";

import { ModeToggle } from "@/components/ModeToggleButton";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function signout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signout successfuly");
        },
      },
    });
  }
  return (
    <div>
      <h1>Hello World!</h1>
      <ModeToggle />

      {session ? (
        <>
          <p>{session.user.name}</p>
          <Button onClick={signout} className="bg-red-700 hover:bg-red-500">Logout</Button>
        </>
      ) : (
        <Button className="bg-blue-600 hover:bg-blue-500">Login</Button>
      )}
    </div>
  );
}
