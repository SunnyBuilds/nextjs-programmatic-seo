import seeds from './seeds.json';

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  price: string;
  cuisine: string;
  address: string;
  phone: string;
  hours: string;
  reviews: number;
  tags: string[];
}

export function getLocations(): string[] {
  const locations = new Set<string>();
  seeds.forEach((item) => {
    if (item.keyword) {
      const parts = item.keyword.split(' in ');
      if (parts.length === 2) {
        locations.add(parts[1]);
      }
    }
  });
  return Array.from(locations);
}

export function getTerms(): string[] {
  const terms = new Set<string>();
  seeds.forEach((item) => {
    if (item.keyword) {
      const parts = item.keyword.split(' in ');
      if (parts.length > 0) {
        terms.add(parts[0]);
      }
    }
  });
  return Array.from(terms);
}

export async function getData(location: string, term: string): Promise<Restaurant[]> {
  // Normalize inputs: lowercase and replace hyphens with spaces
  const normalizedLocation = location.toLowerCase().replace(/-/g, ' ');
  const normalizedTerm = term.toLowerCase().replace(/-/g, ' ');

  const filteredItems = seeds.filter((item) => {
    if (!item.keyword) return false;
    const keyword = item.keyword.toLowerCase();
    // Check if the keyword contains both the term and the location
    return keyword.includes(normalizedTerm) && keyword.includes(normalizedLocation);
  });

  // Map to Restaurant interface
  return filteredItems.map((item, index) => {
    return {
      id: index + 1, // Simple ID based on index
      name: item.name,
      // Use a placeholder image or cycle through a few
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      rating: item.rating || 4.5,
      price: "$$", // Default value
      cuisine: term, // Use the term as the cuisine type
      address: item.address || "Address not available",
      phone: item.phone || "Phone not available",
      hours: "11:00 AM - 10:00 PM", // Default value
      reviews: Math.floor(Math.random() * 500) + 50, // Randomize reviews for variety
      tags: ["Lunch", "Dinner", term],
    };
  });
}
