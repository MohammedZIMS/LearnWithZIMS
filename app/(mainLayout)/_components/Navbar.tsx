'use client';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/Logo.png";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LayoutDashboard, Home, BookOpen, LogOut, User, LogIn } from "lucide-react";
import { toast } from "sonner";
import { UserDropdown } from "./UserDropdown";
import { ModeToggle } from "@/components/ModeToggleButton";

const navigationItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Courses", href: "/courses", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
]

export function Navbar() {
    const { data: session, isPending } = authClient.useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto px-4">
                <div className="flex items-center space-x-4">
                    <Link href={"/"} className="flex items-center space-x-2 group">
                        <Image
                            src={Logo}
                            alt="Logo"
                            className="size-8 transition-transform group-hover:scale-110"
                        />
                        <span className="font-bold text-lg tracking-tight">
                            Learn with <span className="text-primary">ZIMS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1 ml-6">
                        {navigationItems.map((item) => (
                            <Button
                                key={item.name}
                                asChild
                                variant="ghost"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                <Link href={item.href}>
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </nav>

                </div>
                <div className="flex items-center space-x-3">
                    <ModeToggle/>
                    <UserDropdown/>
                </div>
            </div>

            {/* Mobile Navigation */}
            {session && (
                <nav className="md:hidden border-t py-2 px-4 flex justify-around">
                    {navigationItems.map((item) => (
                        <Button
                            key={item.name}
                            asChild
                            variant="ghost"
                            className="flex flex-col items-center h-auto px-2 py-1"
                        >
                            <Link href={item.href} className="text-xs">
                                <div className="mb-1">
                                    {item.icon}
                                </div>
                                {item.name}
                            </Link>
                        </Button>
                    ))}
                </nav>
            )}
        </header>
    );
}