"use client";

import { SearchBar } from "@upstash/search-ui";
import "@upstash/search-ui/dist/index.css";
import { Search } from "@upstash/search";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

// Initialize Upstash Search Client
const client = new Search({
  url: env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_URL,
  token: env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_TOKEN,
});

// Define data structures
type Courses = {
  title: string;
  smallDescription: string;
  category: string;
  price: number;
  level: string;
  slug: string;
};

type Metadata = {
  id: string;
  description: string;
  duration: number;
  fileKey: string;
};

// Create index reference
const index = client.index<Courses, Metadata>("main");

export function SearchBarInput() {
  const router = useRouter();

  return (
    <div className="w-40 sm:w-52 md:w-64">
      <SearchBar.Dialog>
        {/* Trigger (input field visible in navbar) */}
        <SearchBar.DialogTrigger placeholder="Search course..." />

        {/* Modal-like search dialog */}
        <SearchBar.DialogContent>
          <SearchBar.Input placeholder="Type to search course..." />

          {/* Results section */}
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
  );
}
