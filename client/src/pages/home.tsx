import { useState } from "react";
import { DaySelector } from "@/components/day-selector";
import { SeasonSelector } from "@/components/season-selector";
import { DayOfWeek, JikanAnime } from "@shared/schema";
import { useCurrentSeason } from "@/hooks/use-current-season";
import { useSeasonAnime } from "@/hooks/use-season-anime";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { formatDayName, getCurrentDay } from "@/lib/utils/date-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

// Define valid seasons
const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = typeof SEASONS[number];

// Define response types for the API
interface DaySeasonResponse {
  animes: JikanAnime[];
  season: Season;
  year: number;
  day: DayOfWeek;
}

interface SeasonResponse {
  schedule: Record<string, JikanAnime[]>;
  season: Season;
  year: number;
}

export default function Home() {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDay());
  
  // Get current season and year
  const getCurrentSeason = (): { season: Season, year: number } => {
    const now = new Date();
    const seasons = ["winter", "spring", "summer", "fall"] as const;
    const currentSeason = seasons[Math.floor(now.getMonth() / 3)];
    const currentYear = now.getFullYear();
    return { season: currentSeason, year: currentYear };
  };
  
  const { season: initialSeason, year: initialYear } = getCurrentSeason();
  
  // State for selected season/year
  const [selectedSeason, setSelectedSeason] = useState<Season>(initialSeason);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [isCustomSeason, setIsCustomSeason] = useState<boolean>(false);
  
  // Handler for season selection
  const handleSelectSeason = (year: number, season: Season) => {
    setSelectedYear(year);
    setSelectedSeason(season);
    setIsCustomSeason(true);
  }
  
  // Handler to reset to current season
  const handleResetToCurrentSeason = () => {
    const { season, year } = getCurrentSeason();
    setSelectedSeason(season);
    setSelectedYear(year);
    setIsCustomSeason(false);
  };
  
  // Use current season hook for initial/current season
  const currentSeasonResult = useCurrentSeason(selectedDay);
  
  // Use season anime hook for custom seasons
  const seasonAnimeResult = useSeasonAnime({
    year: selectedYear,
    season: selectedSeason,
    day: selectedDay
  });
  
  // Determine which data to use based on whether a custom season is selected
  const { 
    data: schedule,
    isLoading,
    isError,
    error
  } = isCustomSeason 
    ? seasonAnimeResult 
    : currentSeasonResult;
  
  // Extract the anime array from the response
  const animeSchedule = isCustomSeason && schedule 
    ? (schedule as DaySeasonResponse).animes || []
    : schedule as JikanAnime[] || [];
  
  const handlePrevDay = () => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const currentIndex = days.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(days[currentIndex - 1] as DayOfWeek);
    } else {
      setSelectedDay("sunday");
    }
  };

  const handleNextDay = () => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const currentIndex = days.indexOf(selectedDay);
    if (currentIndex < days.length - 1) {
      setSelectedDay(days[currentIndex + 1] as DayOfWeek);
    } else {
      setSelectedDay("monday");
    }
  };
  
  return (
    <div className="py-6 pb-20 md:pb-6">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                {t.appName}
              </span>
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="capitalize">{isCustomSeason 
                  ? `${t[selectedSeason]} ${selectedYear}`
                  : `${t[initialSeason]} ${initialYear}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="px-4 sm:px-6 md:px-8 mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              <span className="text-gray-900 dark:text-gray-100">{t.weeklySchedule}</span>
            </span>
          </h3>
          <div className="flex space-x-2">
            <button 
              type="button" 
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 shadow-md text-sm font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-primary transition-all duration-200 transform hover:scale-105"
              onClick={handlePrevDay}
            >
              <ChevronLeft className="h-4 w-4 mr-1 text-orange-500" />
              {t.prev}
            </button>
            <button 
              type="button" 
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 shadow-md text-sm font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-primary transition-all duration-200 transform hover:scale-105"
              onClick={handleNextDay}
            >
              {t.next}
              <ChevronRight className="h-4 w-4 ml-1 text-orange-500" />
            </button>
          </div>
        </div>
        
        {/* Season Selector */}
        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-5 border border-gray-200 dark:border-gray-800 shadow-inner overflow-hidden">
          <SeasonSelector 
            onSelectSeason={handleSelectSeason}
            className="mb-2 w-full"
          />
          
          {isCustomSeason && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetToCurrentSeason}
                className="text-sm px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-400 shadow-sm hover:shadow transition-all duration-200 font-medium flex items-center space-x-1 transform hover:scale-105"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{t.backToSchedule}</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Day Selector */}
        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-5 border border-gray-200 dark:border-gray-800 shadow-inner">
          <DaySelector 
            selectedDay={selectedDay} 
            onSelectDay={setSelectedDay}
          />
        </div>
        
        {/* Daily Schedule */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold capitalize flex items-center">
              <span className="mr-1.5 text-orange-500">•</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                {`${t[selectedDay as keyof typeof t]}'s Anime`}
              </span>
            </h2>
            {animeSchedule && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({animeSchedule.length} {animeSchedule.length === 1 ? t.show : t.shows})
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
          ) : animeSchedule && animeSchedule.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {animeSchedule.map((anime: JikanAnime, index: number) => (
                <AnimeCard key={`${anime.mal_id}-${index}-${selectedDay}`} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t.noAnimeFound}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t.noAnimeScheduled}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
