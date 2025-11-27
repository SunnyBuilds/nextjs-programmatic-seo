"use client";

import SearchableSelect from "@/components/SearchableSelect";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  q?: string;
  location?: string;
  locations?: string[];
  terms?: string[];
}

export default function Header({
  q,
  location,
  locations = [],
  terms = [],
}: HeaderProps) {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = formData.get("q") as string;
    const location = formData.get("location") as string;
    const newSearchParams = new URLSearchParams();
    if (q) newSearchParams.set("q", q);
    if (location) newSearchParams.set("location", location);
    router.push(`/search?${newSearchParams.toString()}`);
  }

  return (
    <header className="bg-primary py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <span className="text-3xl font-bold text-primary-foreground">
              Restaurant Finder
            </span>
          </Link>
          <form
            action="/"
            onSubmit={handleSubmit}
            className="flex w-full max-w-2xl flex-wrap gap-2 sm:flex-nowrap"
            key={`${q}-${location}`}
          >
            <div className="w-full sm:w-auto flex-1">
              <SearchableSelect
                name="q"
                placeholder="Search cuisine..."
                defaultValue={q}
                options={terms}
                emptyMessage="No cuisine found."
              />
            </div>
            <div className="w-full sm:w-auto flex-none">
              <SearchableSelect
                name="location"
                placeholder="Select location..."
                defaultValue={location}
                options={locations}
                emptyMessage="No location found."
              />
            </div>
            <Button variant="secondary" className="w-full sm:w-auto">
              <Search className="size-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
