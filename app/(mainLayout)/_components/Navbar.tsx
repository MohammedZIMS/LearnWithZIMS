"use client";

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

const navigationItems = [
  { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
  { name: "Courses", href: "/courses", icon: <BookOpen className="w-4 h-4 mr-2" /> },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
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
}

const index = client.index<Courses, Metadata>("main");

export function Navbar() {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";

  const router = useRouter(); 

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* --- Left: Logo + Navigation --- */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
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
          <nav className="sm:hidden md:flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary px-3"
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* --- Right: Search, Admin, Mode, User --- */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <div className="w-36 lg:w-56">
            <SearchBar.Dialog>
              <SearchBar.DialogTrigger placeholder="Search course..." />
              <SearchBar.DialogContent>
                <SearchBar.Input placeholder="Type to search course..." />
                <SearchBar.Results
                  searchFn={(query) => index.search({ query, limit: 10, reranking: true })}
                >
                  {(result) => (
                    <SearchBar.Result
                      value={result.id}
                      key={result.id}
                      onSelect={() => router.push(`/courses/${result.content.slug}`)}
                    >
                      <SearchBar.ResultIcon>
                        <FileText className="text-gray-600" />
                      </SearchBar.ResultIcon>
                      <SearchBar.ResultContent>
                        <SearchBar.ResultTitle>
                          {result.content.title}
                        </SearchBar.ResultTitle>
                        <p className="text-xs text-gray-500 mt-0.5">Course</p>
                      </SearchBar.ResultContent>
                    </SearchBar.Result>
                  )}
                </SearchBar.Results>
              </SearchBar.DialogContent>
            </SearchBar.Dialog>
          </div>

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
        <nav className="sm:hidden">
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
