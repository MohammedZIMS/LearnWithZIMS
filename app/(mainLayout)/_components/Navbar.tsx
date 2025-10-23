"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/Logo.png";
import { authClient } from "@/lib/auth-client";
import { LayoutDashboard, Home, BookOpen, Shield } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { ModeToggle } from "@/components/ModeToggleButton";

const navigationItems = [
  { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
  { name: "Courses", href: "/courses", icon: <BookOpen className="w-4 h-4 mr-2" /> },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
];

export function Navbar() {
  const { data: session } = authClient.useSession();

  // Make role check consistent (case-insensitive)
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* --- Left: Logo + Navigation --- */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src={Logo}
              alt="Logo"
              className="size-8 transition-transform group-hover:scale-110"
            />
            <span className="font-bold text-lg tracking-tight">
              Learn with <span className="text-primary">ZIMS</span>
            </span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-1 ml-6">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* --- Right: Admin, Mode, User --- */}
        <div className="flex items-center space-x-3">
          {/* Admin Dashboard button */}
          {isAdmin && (
            <Button
              asChild
              variant="outline"
              className="hidden md:inline-flex items-center gap-2 text-primary border-primary"
            >
              <Link href="/admin-dashboard">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </Button>
          )}

          <ModeToggle />
          <UserDropdown />
        </div>
      </div>

      {/* --- Mobile Navigation --- */}
      {session && (
        <nav className="md:hidden border-t py-2 px-4 flex justify-around bg-background/80 backdrop-blur">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className="flex flex-col items-center h-auto px-2 py-1"
            >
              <Link href={item.href} className="text-xs flex flex-col items-center">
                <div className="mb-1">{item.icon}</div>
                {item.name}
              </Link>
            </Button>
          ))}

          {/* Admin shortcut in mobile view */}
          {isAdmin && (
            <Button
              asChild
              variant="ghost"
              className="flex flex-col items-center h-auto px-2 py-1 text-xs text-primary"
            >
              <Link href="/admin-dashboard">
                <Shield className="w-4 h-4 mb-1" />
                Admin
              </Link>
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
