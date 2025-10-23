import { ModeToggle } from "@/components/ModeToggleButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-signout";
import { authClient } from "@/lib/auth-client";
import { BookOpen, Home, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navigationItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Courses", href: "/courses", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
]

export function UserDropdown() {
    const { data: session, isPending } = authClient.useSession();
    const handleSignout = useSignout();

    return (
        <>
            {session ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full p-0"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={ session.user.image ||""}
                                    alt={session.user?.name || "User"}
                                />
                                <AvatarFallback className="bg-primary text-white font-medium">
                                    {session.user?.name
                                        ?.split(" ")
                                        .map(n => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {session.user?.name || "User"}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session.user?.email || "user@example.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {navigationItems.map((item) => (
                                <DropdownMenuItem key={item.name} asChild>
                                    <Link href={item.href} className="cursor-pointer">
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignout} className="cursor-pointer">
                            <LogOut className="w-4 h-4 mr-2" />
                            <samp>Logout</samp>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex space-x-2">
                    <Button asChild className="text-white">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            )}
        </>
    )
}