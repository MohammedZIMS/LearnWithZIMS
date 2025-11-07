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
              <SearchBar.Dialog>
                <SearchBar.DialogTrigger placeholder="Search course..." />
                <SearchBar.DialogContent>
                  <SearchBar.Input placeholder="Type to search course..." />
                  <SearchBar.Results
                    searchFn={(query) =>
                      index.search({ query, limit: 10, reranking: true })
                    }
                  >
                    {(result) => (
                      <SearchBar.Result
                        value={result.id}
                        key={result.id}
                        onSelect={() =>
                          router.push(`/courses/${result.content.slug}`)
                        }
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

            {isAdmin && (
              <Button
                asChild
                variant="outline"
                className="md:inline-flex items-center gap-1 text-primary border-primary"
              >
                <Link href="/admin-dashboard">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}

            <ModeToggle />
            <UserDropdown />

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>



        {/* --- Desktop Navigation + Search (hidden on mobile) --- */}
        <div className="hidden md:flex items-center justify-between mt-2">
          <nav className="flex space-x-3">
            {navigationItems.map((item) => (
              <Button key={item.name} asChild variant="ghost" className="px-3">
                <Link href={item.href} className="flex items-center gap-1">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>


        </div>

        {/* --- Mobile Menu (navigation + search) --- */}
        {mobileOpen && (
          <div className="md:hidden mt-2 border-t pt-2">
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

              <div className="mt-2 w-full">
                <SearchBar.Dialog>
                  <SearchBar.DialogTrigger placeholder="Search course..." />
                  <SearchBar.DialogContent>
                    <SearchBar.Input placeholder="Type to search course..." />
                    <SearchBar.Results
                      searchFn={(query) =>
                        index.search({ query, limit: 10, reranking: true })
                      }
                    >
                      {(result) => (
                        <SearchBar.Result
                          value={result.id}
                          key={result.id}
                          onSelect={() => {
                            setMobileOpen(false);
                            router.push(`/courses/${result.content.slug}`);
                          }}
                        >
                          <SearchBar.ResultIcon>
                            <FileText className="text-gray-600" />
                          </SearchBar.ResultIcon>
                          <SearchBar.ResultContent>
                            <SearchBar.ResultTitle>
                              {result.content.title}
                            </SearchBar.ResultTitle>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Course
                            </p>
                          </SearchBar.ResultContent>
                        </SearchBar.Result>
                      )}
                    </SearchBar.Results>
                  </SearchBar.DialogContent>
                </SearchBar.Dialog>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
