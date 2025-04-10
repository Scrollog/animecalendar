import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Star, Calendar, Clock } from "lucide-react";
import { formatDayName } from "@/lib/utils/date-utils";
import { JikanAnime } from "@shared/schema";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AnimeDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { data: animeData, isLoading, isError } = useQuery<{data: JikanAnime}>({
    queryKey: [`/api/anime/${id}`],
    retry: 1
  });
  
  if (isLoading) {
    return <AnimeDetailsSkeleton />;
  }
  
  if (isError || !animeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <strong className="font-bold">{t.error}:</strong>
          <span className="block sm:inline ml-1">{t.failedToLoad}</span>
        </div>
        <Link href="/" className="inline-flex items-center text-primary hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t.backToSchedule}
        </Link>
      </div>
    );
  }
  
  const anime = animeData.data;
  
  // Format airing time if available
  const formatBroadcastInfo = () => {
    if (!anime.broadcast || !anime.broadcast.day) {
      return "Unknown broadcast schedule";
    }
    
    let info = `${anime.broadcast.day}s`;
    if (anime.broadcast.time) {
      info += ` at ${anime.broadcast.time}`;
    }
    if (anime.broadcast.timezone) {
      info += ` (${anime.broadcast.timezone})`;
    }
    
    return info;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t.backToSchedule}
      </Link>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        {/* Banner & Poster */}
        <div className="bg-gray-100 dark:bg-gray-800 h-48 md:h-64 relative">
          {anime.images?.jpg?.large_image_url && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm" 
              style={{ 
                backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                backgroundPosition: 'center 30%' 
              }}
            ></div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent"></div>
        </div>
        
        <div className="md:flex px-6">
          {/* Poster */}
          <div className="w-32 md:w-48 -mt-16 md:-mt-24 z-10 mx-auto md:mx-0 relative mb-4 md:mb-0">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md border-4 border-white dark:border-gray-700">
              <img 
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} 
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Info */}
          <div className="md:ml-8 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                {anime.type || 'TV'}
              </Badge>
              
              {anime.status && (
                <Badge variant="outline" className={
                  anime.status.toLowerCase().includes('airing')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                }>
                  {anime.status}
                </Badge>
              )}
              
              {anime.rating && (
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                  {anime.rating}
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {anime.title}
            </h1>
            
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                {anime.title_english}
              </h2>
            )}
            
            {anime.title_japanese && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {anime.title_japanese}
              </p>
            )}
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
              {anime.score && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{anime.score}</span>
                </div>
              )}
              
              {anime.broadcast?.day && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-primary mr-1" />
                  <span>{formatDayName(anime.broadcast.day.toLowerCase())}</span>
                </div>
              )}
              
              {anime.broadcast?.time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-primary mr-1" />
                  <span>{anime.broadcast.time} {anime.broadcast.timezone || 'JST'}</span>
                </div>
              )}
              
              {anime.season && anime.year && (
                <div className="flex items-center">
                  <span className="capitalize">{anime.season} {anime.year}</span>
                </div>
              )}
              
              {anime.episodes && (
                <div className="flex items-center">
                  <span>{anime.episodes} {anime.episodes === 1 ? t.episode : t.episodes}</span>
                </div>
              )}
            </div>
            
            {anime.synopsis && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t.synopsis}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t.animeDetails}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm flex items-center">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                {formatBroadcastInfo()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimeDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="inline-flex items-center text-gray-400 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        {/* Banner Skeleton */}
        <Skeleton className="h-48 md:h-64 w-full" />
        
        <div className="md:flex px-6">
          {/* Poster Skeleton */}
          <div className="w-32 md:w-48 -mt-16 md:-mt-24 z-10 mx-auto md:mx-0 relative mb-4 md:mb-0">
            <Skeleton className="aspect-[3/4] rounded-lg" />
          </div>
          
          {/* Info Skeleton */}
          <div className="md:ml-8 flex-1">
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <Skeleton className="h-px w-full mb-4" />
            
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
