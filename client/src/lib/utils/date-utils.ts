import { DayOfWeek } from "@shared/schema";

/**
 * Format day name to proper case with full name
 */
export function formatDayName(day: string): string {
  if (!day) return "Unknown";
  
  // Handle special case for "other"
  if (day.toLowerCase() === "other") return "Other";
  
  // Capitalize first letter
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
}

/**
 * Get the current day of the week as a string
 */
export function getCurrentDay(): DayOfWeek {
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday", 
    "wednesday", 
    "thursday", 
    "friday", 
    "saturday"
  ];
  
  const today = new Date();
  return days[today.getDay()];
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/**
 * Format broadcast time from 24-hour format to 12-hour format
 */
export function formatBroadcastTime(time: string | null | undefined): string {
  if (!time) return "Unknown";
  
  // Check if the time is already in the correct format
  if (time.includes("AM") || time.includes("PM")) {
    return time;
  }
  
  try {
    // Try to parse the time as 24-hour format (e.g. "23:30")
    const [hoursStr, minutesStr] = time.split(":");
    
    if (!hoursStr || !minutesStr) {
      return time;
    }
    
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return time;
    }
    
    // Convert to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch (error) {
    // If parsing fails, return the original time
    return time;
  }
}
