import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Anime schema representing anime information
export const animes = pgTable("animes", {
  id: serial("id").primaryKey(),
  malId: integer("mal_id").notNull().unique(),
  title: text("title").notNull(),
  titleEnglish: text("title_english"),
  titleJapanese: text("title_japanese"),
  imageUrl: text("image_url"),
  synopsis: text("synopsis"),
  type: text("type"),
  source: text("source"),
  episodes: integer("episodes"),
  status: text("status"),
  airing: boolean("airing"),
  airingDay: text("airing_day"),
  broadcastTime: text("broadcast_time"),
  score: text("score"),
  year: integer("year"),
  season: text("season"),
});

// Schema for inserting an anime
export const insertAnimeSchema = createInsertSchema(animes).omit({
  id: true
});

// Type definitions for better TypeScript integration
export type InsertAnime = z.infer<typeof insertAnimeSchema>;
export type Anime = typeof animes.$inferSelect;

// Custom types for Jikan API responses
export interface JikanAnimeResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string | null;
  };
  duration: string;
  rating: string;
  score: number | null;
  synopsis: string;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
}

// Types for the weekly schedule
export interface WeeklySchedule {
  [key: string]: JikanAnime[];
}

// Days of the week for consistent reference
export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "other"
];

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
