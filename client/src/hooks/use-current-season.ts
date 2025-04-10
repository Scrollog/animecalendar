import { useQuery } from "@tanstack/react-query";
import { DayOfWeek, JikanAnime } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ScheduleResponse {
  animes: JikanAnime[];
}

export function useCurrentSeason(day: DayOfWeek = "monday") {
  const { toast } = useToast();
  
  // Use React Query to fetch the data
  const query = useQuery({
    queryKey: [`/api/schedule/${day}`]
  });
  
  // Handle errors with an effect
  useEffect(() => {
    if (query.error) {
      toast({
        variant: "destructive",
        title: "Error loading schedule",
        description: query.error instanceof Error 
          ? query.error.message 
          : "Failed to load anime schedule. Please try again later."
      });
    }
  }, [query.error, toast]);
  
  // Extract anime data safely
  let animeList: JikanAnime[] = [];
  if (query.data && typeof query.data === 'object' && query.data !== null) {
    const typedData = query.data as any;
    if (typedData.animes && Array.isArray(typedData.animes)) {
      animeList = typedData.animes;
    }
  }
  
  return {
    ...query,
    data: animeList
  };
}
