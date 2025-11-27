import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Restaurant } from "@/lib/db";
import { getRandomImage } from "@/lib/images";
import { Clock, MapPin, Phone, Star, StarHalf } from "lucide-react";
import Image from "next/image";

interface RestaurantItemProps {
  restaurant: Restaurant;
}

export default function RestaurantItem({ restaurant }: RestaurantItemProps) {
  // Always use the random local image logic as per instruction to "permanently disable fragile real images"
  // This ensures high performance and stability with local WebP assets.
  const displayImage = getRandomImage(restaurant.cuisine || restaurant.name || "default");

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={displayImage}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{restaurant.name}</CardTitle>
            <CardDescription>
              {restaurant.cuisine} • {restaurant.price}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <div className="mr-2 flex">
              <StarRating rating={restaurant.rating} />
            </div>
            <span className="text-sm text-muted-foreground">
              ({restaurant.reviews})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="text-sm">{restaurant.address}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            <span className="text-sm">{restaurant.phone}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-sm">{restaurant.hours}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {restaurant.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StarRatingProps {
  rating: number;
}

function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf
          key="half-star"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      )}
    </div>
  );
}
