import { animes, type Anime, type InsertAnime, JikanAnime, WeeklySchedule, DayOfWeek, DAYS_OF_WEEK } from "@shared/schema";

// Interface for anime storage operations
export interface IStorage {
  // Get anime by ID
  getAnime(id: number): Promise<Anime | undefined>;
  
  // Get anime by MAL ID
  getAnimeByMalId(malId: number): Promise<Anime | undefined>;
  
  // Create a new anime entry
  createAnime(anime: InsertAnime): Promise<Anime>;
  
  // Get weekly schedule organized by day
  getWeeklySchedule(): Promise<WeeklySchedule>;
  
  // Get animes for a specific day
  getAnimesByDay(day: DayOfWeek): Promise<JikanAnime[]>;
  
  // Cache the weekly schedule from Jikan API
  cacheWeeklySchedule(schedule: WeeklySchedule): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private animes: Map<number, Anime>;
  private weeklySchedule: WeeklySchedule;
  currentId: number;

  constructor() {
    this.animes = new Map();
    this.currentId = 1;
    this.weeklySchedule = DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as WeeklySchedule);
  }

  async getAnime(id: number): Promise<Anime | undefined> {
    return this.animes.get(id);
  }

  async getAnimeByMalId(malId: number): Promise<Anime | undefined> {
    return Array.from(this.animes.values()).find(
      (anime) => anime.malId === malId
    );
  }

  async createAnime(insertAnime: InsertAnime): Promise<Anime> {
    const id = this.currentId++;
    const anime: Anime = { ...insertAnime, id };
    this.animes.set(id, anime);
    return anime;
  }

  async getWeeklySchedule(): Promise<WeeklySchedule> {
    return this.weeklySchedule;
  }

  async getAnimesByDay(day: DayOfWeek): Promise<JikanAnime[]> {
    return this.weeklySchedule[day] || [];
  }

  async cacheWeeklySchedule(schedule: WeeklySchedule): Promise<void> {
    this.weeklySchedule = schedule;
  }
}

// Create and export storage instance
export const storage = new MemStorage();
