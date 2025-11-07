"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/Logo.png";
import { authClient } from "@/lib/auth-client";
import { LayoutDashboard, Home, BookOpen, Shield, FileText } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { ModeToggle } from "@/components/ModeToggleButton";
import { SearchBar } from "@upstash/search-ui";
import "@upstash/search-ui/dist/index.css";
import { Search } from "@upstash/search";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { SearchBarInput } from "@/components/SeachBar";

const navigationItems = [
  { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  { name: "Courses", href: "/courses", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
];

const client = new Search({
  url: env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_URL,
  token: env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_TOKEN,
});

type Courses = {
  title: string[];
  smallDescription: string[];
  category: string[];
  price: number;
  level: string[];
  slug: string[];
};

type Metadata = {
  id: string[];
  description: string[];
  duration: number;
  fileKey: string[];
};

const index = client.index<Courses, Metadata>("main");

export function Navbar() {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        {/* --- Desktop & Mobile Top Row --- */}
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src={Logo}
              alt="Logo"
              className="h-8 w-8 transition-transform group-hover:scale-110"
            />
            <span className="font-bold text-lg tracking-tight">
              Learn with <span className="text-primary">ZIMS</span>
            </span>
          </Link>
          


          {/* Right: Admin / Mode / User + Hamburger */}
          <div className="flex items-center space-x-2">

            {/* Desktop Search */}
            <div className="w-40  md:flex ">
              <SearchBarInput />
            </div>
            <ModeToggle />
            <UserDropdown />

            
          </div>
        </div>
        

        {/* --- Mobile Menu (navigation + search) --- */}
        {mobileOpen && (
          <div className=" mt-2 border-t pt-2">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              ))}

              {isAdmin && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/admin-dashboard" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                </Button>
              )}

              <div className="mt-2 w-fit">
                <SearchBarInput />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
