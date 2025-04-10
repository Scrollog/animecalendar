import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { JikanAnimeResponse, WeeklySchedule, DAYS_OF_WEEK, DayOfWeek } from "@shared/schema";
import { z } from "zod";

// Configure Jikan API base URL
const JIKAN_API_BASE_URL = "https://api.jikan.moe/v4";

// Helper function to handle API rate limits
async function fetchWithRetry(url: string, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      // Handle rate limiting
      if (response.status === 429) {
        console.log(`Rate limited, waiting ${delay}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}

// Define valid seasons
const VALID_SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = typeof VALID_SEASONS[number];

// Get current season
function getCurrentSeason(): { season: Season, year: number } {
  const now = new Date();
  const seasons = ["winter", "spring", "summer", "fall"] as const;
  const currentSeason = seasons[Math.floor(now.getMonth() / 3)];
  const currentYear = now.getFullYear();
  return { season: currentSeason, year: currentYear };
}

// Validate season and year
function isValidSeason(season: string): season is Season {
  return VALID_SEASONS.includes(season as Season);
}

// Fetch a specific season's anime schedule
async function fetchSeasonSchedule(year: number, season: Season): Promise<WeeklySchedule> {
  console.log(`Fetching ${season} ${year} schedule from Jikan API`);
  
  // Initialize schedule with empty arrays for each day
  const schedule: WeeklySchedule = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as WeeklySchedule);
  
  try {
    // Use the seasons endpoint which provides more consistent data
    const url = `${JIKAN_API_BASE_URL}/seasons/${year}/${season}?sfw`;
    console.log("Fetching from URL:", url);
    
    const response = await fetchWithRetry(url);
    const data = response as any;
    
    console.log("Jikan API Response Structure:", Object.keys(data));
    
    // Process seasonal anime data and organize by broadcast day
    if (data.data && Array.isArray(data.data)) {
      const animeList = data.data;
      console.log(`Retrieved ${animeList.length} anime for ${season} ${year}`);
      
      // Group anime by broadcast day
      for (const anime of animeList) {
        let targetDay = 'other';
        
        // Determine which day this should go into based on broadcast information
        if (anime.broadcast && anime.broadcast.day) {
          const broadcastDay = anime.broadcast.day.toLowerCase();
          
          // Map days like "Mondays" to "monday"
          const normalizedDay = broadcastDay.endsWith('s') 
            ? broadcastDay.substring(0, broadcastDay.length - 1) 
            : broadcastDay;
            
          if (DAYS_OF_WEEK.includes(normalizedDay as DayOfWeek)) {
            targetDay = normalizedDay as DayOfWeek;
          }
        }
        
        // Add to the appropriate day
        if (targetDay in schedule) {
          schedule[targetDay].push(anime);
        }
      }
    }
    
    console.log("Processed Schedule:", Object.keys(schedule).map(day => 
      `${day}: ${schedule[day].length} anime`
    ));
    
    return schedule;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
}

// Fetch the current season's anime schedule (for backward compatibility)
async function fetchCurrentSeasonSchedule(): Promise<WeeklySchedule> {
  const { season, year } = getCurrentSeason();
  return fetchSeasonSchedule(year, season);
}

// Helper to get anime details by ID
async function fetchAnimeById(malId: number) {
  try {
    const response = await fetchWithRetry(`${JIKAN_API_BASE_URL}/anime/${malId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching anime ${malId}:`, error);
    throw error;
  }
}

// Helper to search for anime by query
async function searchAnime(query: string) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(query)}&sfw=true&limit=20`;
    console.log(`Searching for anime at URL: ${url}`);
    
    const response = await fetchWithRetry(url);
    
    // Ensure we return the expected structure even if Jikan API changes its format
    if (response && typeof response === 'object') {
      // If response is already properly structured
      if (response.data && Array.isArray(response.data)) {
        return response;
      }
      
      // If data is not in expected format, adapt it
      if (Array.isArray(response)) {
        return { data: response };
      }
    }
    
    // Fallback if response doesn't match any known format
    return { data: [] };
  } catch (error) {
    console.error(`Error searching anime with query "${query}":`, error);
    return { data: [] }; // Return empty array on error
  }
}

// Helper to fetch popular anime - either top anime overall or by season
async function fetchPopularAnime(season?: string, year?: number) {
  try {
    let url;
    
    // If season and year are provided, fetch popular anime from that specific season
    if (season && year && isValidSeason(season)) {
      url = `${JIKAN_API_BASE_URL}/seasons/${year}/${season}?sfw=true&order_by=score&sort=desc&limit=24`;
      console.log(`Fetching popular anime for ${season} ${year}`);
    } else {
      // Otherwise, fetch the top anime overall
      url = `${JIKAN_API_BASE_URL}/top/anime?sfw=true&limit=24`;
      console.log(`Fetching overall top anime`);
    }
    
    const response = await fetchWithRetry(url);
    
    // Ensure we return the expected structure
    if (response && typeof response === 'object') {
      if (response.data && Array.isArray(response.data)) {
        return response;
      }
      
      if (Array.isArray(response)) {
        return { data: response };
      }
    }
    
    return { data: [] };
  } catch (error) {
    console.error(`Error fetching popular anime:`, error);
    return { data: [] }; // Return empty array on error
  }
}

// Register API routes
export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Get the weekly schedule
  app.get("/api/schedule", async (req, res) => {
    try {
      // Try to get cached schedule first
      let schedule = await storage.getWeeklySchedule();
      
      // Check if schedule is empty - need to fetch from API
      if (Object.values(schedule).every(array => array.length === 0)) {
        schedule = await fetchCurrentSeasonSchedule();
        await storage.cacheWeeklySchedule(schedule);
      }
      
      res.json({ schedule });
    } catch (error) {
      console.error("Error getting schedule:", error);
      res.status(500).json({ message: "Failed to fetch anime schedule" });
    }
  });
  
  // Get schedule for a specific day
  app.get("/api/schedule/:day", async (req, res) => {
    try {
      const daySchema = z.enum(DAYS_OF_WEEK as [string, ...string[]]);
      const parseResult = daySchema.safeParse(req.params.day.toLowerCase());
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: `Invalid day. Must be one of: ${DAYS_OF_WEEK.join(", ")}` 
        });
      }
      
      const day = parseResult.data as DayOfWeek;
      
      let schedule = await storage.getWeeklySchedule();
      
      // If schedule is empty, fetch from API
      if (Object.values(schedule).every(array => array.length === 0)) {
        schedule = await fetchCurrentSeasonSchedule();
        await storage.cacheWeeklySchedule(schedule);
      }
      
      res.json({ animes: schedule[day] || [] });
    } catch (error) {
      console.error(`Error getting schedule for ${req.params.day}:`, error);
      res.status(500).json({ message: "Failed to fetch day schedule" });
    }
  });
  
  // Get anime details by ID
  app.get("/api/anime/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid anime ID" });
      }
      
      const animeData = await fetchAnimeById(id);
      res.json(animeData);
    } catch (error) {
      console.error("Error fetching anime details:", error);
      res.status(500).json({ message: "Failed to fetch anime details" });
    }
  });
  
  // Get schedule for a specific season and year
  app.get("/api/seasons/:year/:season", async (req, res) => {
    try {
      // Parse and validate year
      const year = parseInt(req.params.year);
      if (isNaN(year) || year < 1990 || year > 2030) {
        return res.status(400).json({ message: "Invalid year. Must be between 1990 and 2030" });
      }
      
      // Validate season
      const season = req.params.season.toLowerCase();
      if (!isValidSeason(season)) {
        return res.status(400).json({ 
          message: `Invalid season. Must be one of: ${VALID_SEASONS.join(", ")}` 
        });
      }
      
      // Get schedule for the specified season and year
      const schedule = await fetchSeasonSchedule(year, season);
      
      res.json({ 
        schedule,
        season,
        year
      });
    } catch (error) {
      console.error(`Error getting schedule for ${req.params.season} ${req.params.year}:`, error);
      res.status(500).json({ message: "Failed to fetch seasonal schedule" });
    }
  });
  
  // Get schedule for a specific day of a specific season
  app.get("/api/seasons/:year/:season/:day", async (req, res) => {
    try {
      // Parse and validate year
      const year = parseInt(req.params.year);
      if (isNaN(year) || year < 1990 || year > 2030) {
        return res.status(400).json({ message: "Invalid year. Must be between 1990 and 2030" });
      }
      
      // Validate season
      const season = req.params.season.toLowerCase();
      if (!isValidSeason(season)) {
        return res.status(400).json({ 
          message: `Invalid season. Must be one of: ${VALID_SEASONS.join(", ")}` 
        });
      }
      
      // Validate day
      const daySchema = z.enum(DAYS_OF_WEEK as [string, ...string[]]);
      const parseResult = daySchema.safeParse(req.params.day.toLowerCase());
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: `Invalid day. Must be one of: ${DAYS_OF_WEEK.join(", ")}` 
        });
      }
      const day = parseResult.data as DayOfWeek;
      
      // Get schedule for the specified season and year
      const schedule = await fetchSeasonSchedule(year, season);
      
      res.json({ 
        animes: schedule[day] || [],
        season,
        year,
        day
      });
    } catch (error) {
      console.error(`Error getting schedule for ${req.params.day} in ${req.params.season} ${req.params.year}:`, error);
      res.status(500).json({ message: "Failed to fetch seasonal day schedule" });
    }
  });
  
  // Search anime by query
  app.get("/api/search", async (req, res) => {
    try {
      // Get search query from request
      const query = req.query.q as string;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ 
          data: [],
          message: "Search query must be at least 2 characters long" 
        });
      }
      
      // Perform search
      const results = await searchAnime(query.trim());
      
      // Make sure we're returning the expected format
      console.log("Search results:", JSON.stringify(results).substring(0, 200) + "...");
      
      res.json(results);
    } catch (error) {
      console.error(`Error searching anime:`, error);
      res.status(500).json({ data: [], message: "Failed to search anime" });
    }
  });
  
  // Get popular anime
  app.get("/api/popular", async (req, res) => {
    try {
      // Extract optional season and year query parameters
      const season = req.query.season as string;
      const yearParam = req.query.year as string;
      let year: number | undefined = undefined;
      
      if (yearParam) {
        year = parseInt(yearParam);
        if (isNaN(year) || year < 1990 || year > 2030) {
          return res.status(400).json({ message: "Invalid year. Must be between 1990 and 2030" });
        }
      }
      
      // If season is provided, validate it
      if (season && !isValidSeason(season)) {
        return res.status(400).json({ 
          message: `Invalid season. Must be one of: ${VALID_SEASONS.join(", ")}` 
        });
      }
      
      // Fetch popular anime (either for specific season or overall)
      const results = await fetchPopularAnime(season, year);
      
      // Add season and year info to response if provided
      const response: any = { ...results };
      if (season && year) {
        response.season = season;
        response.year = year;
      }
      
      res.json(response);
    } catch (error) {
      console.error(`Error fetching popular anime:`, error);
      res.status(500).json({ data: [], message: "Failed to fetch popular anime" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
