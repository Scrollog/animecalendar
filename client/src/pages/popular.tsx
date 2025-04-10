import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, Star } from "lucide-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { SeasonSelector } from "@/components/season-selector";
import { useLanguage } from "@/lib/i18n/language-context";
import { JikanAnime } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Define season type
type Season = "winter" | "spring" | "summer" | "fall";

// Get current season and year
const getCurrentSeason = (): { season: Season, year: number } => {
  const now = new Date();
  const monthIndex = now.getMonth();
  let seasonIndex = Math.floor(monthIndex / 3);
  const seasons: Season[] = ["winter", "spring", "summer", "fall"];
  const year = now.getFullYear();
  return { season: seasons[seasonIndex], year };
};

export default function PopularPage() {
  const { t } = useLanguage();
  const { season: currentSeason, year: currentYear } = getCurrentSeason();
  const [selectedSeason, setSelectedSeason] = useState<Season>(currentSeason);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isCustomSeason, setIsCustomSeason] = useState<boolean>(false);
  
  // Function to fetch popular anime - can be either top anime or popular from a specific season
  const fetchPopularAnime = async () => {
    try {
      const url = isCustomSeason 
        ? `/api/popular?season=${selectedSeason}&year=${selectedYear}`
        : '/api/popular';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch popular anime: ${response.status}`);
      }
      const result = await response.json();
      
      // Make sure we return the right format
      return result;
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      throw new Error('Failed to fetch popular anime. Please try again.');
    }
  };
  
  // Query for popular anime
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['popular', selectedSeason, selectedYear, isCustomSeason],
    queryFn: fetchPopularAnime,
  });
  
  // Handle season selection
  const handleSelectSeason = (year: number, season: Season) => {
    setSelectedYear(year);
    setSelectedSeason(season);
    setIsCustomSeason(true);
  };
  
  // Reset to overall top anime
  const handleResetToTopAnime = () => {
    setIsCustomSeason(false);
  };
  
  // Get anime data from response
  const animeList = data?.data || [];
  
  // Get the appropriate title based on whether we're looking at top anime or a specific season
  const getTitle = () => {
    if (isCustomSeason) {
      return `${t.popular} ${t.anime} - ${t[selectedSeason]} ${selectedYear}`;
    }
    return t.topAnime || "Top Anime";
  };
  
  return (
    <div className="py-6 pb-20 md:pb-6">
      <div className="px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 sm:text-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                {getTitle()}
              </span>
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>
                  {isCustomSeason 
                    ? t.seasonPopular || "Season's Most Popular" 
                    : t.allTimePopular || "All-Time Popular"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Season selector for toggling between all-time and seasonal popular */}
        <div className="mt-6 mb-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-5 border border-gray-200 dark:border-gray-800 shadow-inner overflow-hidden">
          <SeasonSelector 
            onSelectSeason={handleSelectSeason}
            className="mb-2 w-full"
          />
          
          {isCustomSeason && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetToTopAnime}
                className="text-sm px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-400 shadow-sm hover:shadow transition-all duration-200 font-medium flex items-center space-x-1 transform hover:scale-105"
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span>{t.showAllTimeTop || "Show All-Time Top"}</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Popular Anime List */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <span className="mr-1.5 text-orange-500">•</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                {isCustomSeason 
                  ? `${t[selectedSeason]} ${selectedYear} ${t.topRated || "Top Rated"}`
                  : t.topRated || "Top Rated"}
              </span>
            </h2>
            {animeList && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({animeList.length} {animeList.length === 1 ? t.show : t.shows})
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
              <strong className="font-bold">{t.error}: </strong>
              <span className="block sm:inline">{error instanceof Error ? error.message : t.failedToLoad}</span>
            </div>
          ) : animeList && animeList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {animeList.map((anime: JikanAnime, index: number) => (
                <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <Star className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t.noAnimeFound}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t.tryDifferentSearch}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}