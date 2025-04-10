import { useQuery } from "@tanstack/react-query";
import { JikanAnime, WeeklySchedule, DayOfWeek } from "@shared/schema";

// Define valid seasons
const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = typeof SEASONS[number];

interface UseSeasonAnimeParams {
  year: number;
  season: Season;
  day?: DayOfWeek;
}

interface SeasonResponse {
  schedule: WeeklySchedule;
  season: Season;
  year: number;
}

interface DaySeasonResponse {
  animes: JikanAnime[];
  season: Season;
  year: number;
  day: DayOfWeek;
}

/**
 * Hook to fetch anime data for a specific season and year
 */
export function useSeasonAnime({ year, season, day }: UseSeasonAnimeParams) {
  // If day is provided, fetch just that day's data
  if (day) {
    return useQuery<DaySeasonResponse>({
      queryKey: [`/api/seasons/${year}/${season}/${day}`],
      enabled: Boolean(year && season && day)
    });
  }
  
  // Otherwise fetch the whole season
  return useQuery<SeasonResponse>({
    queryKey: [`/api/seasons/${year}/${season}`],
    enabled: Boolean(year && season)
  });
}