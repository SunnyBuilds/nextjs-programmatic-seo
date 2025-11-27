import Header from "@/components/Header";
import RestaurantItem from "@/components/RestaurantItem";
import { getData, getLocations, getTerms } from "@/lib/db";
import { Metadata } from "next";
import { cache } from "react";

interface PageProps {
  params: Promise<{ location: string; q: string }>;
}

export const revalidate = 86400; // Refresh cached pages once every 24 hours

export async function generateStaticParams() {
  const locations = getLocations();
  const terms = getTerms();

  return terms.flatMap((term) =>
    locations.map((location) => ({
      location,
      q: term,
    }))
  );
}

const getRestaurants = cache(getData);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { q, location } = await params;

  const qDecoded = decodeURIComponent(q);
  const locationDecoded = decodeURIComponent(location);

  const results = await getRestaurants(locationDecoded, qDecoded);

  return {
    title: `Top ${qDecoded} near ${locationDecoded} - Updated ${new Date().getFullYear()}`,
    description: `Find the best ${qDecoded} near ${locationDecoded}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { q, location } = await params;

  const qDecoded = decodeURIComponent(q);
  const locationDecoded = decodeURIComponent(location);

  const results = await getRestaurants(locationDecoded, qDecoded);
  const locations = getLocations();
  const terms = getTerms();

  return (
    <div>
      <Header
        q={qDecoded}
        location={locationDecoded}
        locations={locations}
        terms={terms}
      />
      <main className="container mx-auto space-y-8 px-4 py-8">
        <h1 className="text-center text-3xl font-bold">
          Top {qDecoded} near {locationDecoded}
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </main>
    </div>
  );
}
