import Header from "@/components/Header";
import RestaurantItem from "@/components/RestaurantItem";
import { getData, getLocations, getTerms } from "@/lib/db";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; location?: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
  const { q = "", location = "Miami, FL" } = await searchParams;

  // Clean the location parameter: remove everything after the comma
  // e.g., "San Francisco, CA" -> "San Francisco"
  const cleanLocation = location.split(',')[0].trim();

  const results = await getData(cleanLocation, q);
  const locations = getLocations();
  const terms = getTerms();

  return (
    <div>
      <Header q={q} location={location} locations={locations} terms={terms} />
      <main className="container mx-auto space-y-8 px-4 py-8">
        <p className="text-center font-semibold">
          Showing {results.length} results for {`"${q}"`} near {location}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
          {results.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No results found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
