import { Card, CardContent } from "@/components/ui/card";
import { JikanAnime } from "@shared/schema";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeCardProps {
  anime: JikanAnime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  // Format broadcast time if available
  const formatBroadcastTime = (anime: JikanAnime) => {
    if (anime.broadcast?.time) {
      return `${anime.broadcast.time} ${anime.broadcast.timezone || 'JST'}`;
    }
    return 'Time unknown';
  };

  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
            alt={anime.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-200"
          />
          <Badge 
            className="absolute top-2 right-2 bg-primary hover:bg-primary"
            variant="default"
          >
            {anime.type || 'TV'}
          </Badge>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-md line-clamp-2 mb-2 hover:text-primary transition-colors">{anime.title}</h3>
          
          <div className="mt-auto flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1 text-primary" />
            <span>{formatBroadcastTime(anime)}</span>
          </div>
          
          {anime.score && (
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-xs font-medium">{anime.score}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-4" />
        
        <div className="mt-auto">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
