import { DAYS_OF_WEEK, DayOfWeek } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { formatDayName } from "@/lib/utils/date-utils";
import { useLanguage } from "@/lib/i18n/language-context";

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  className?: string;
}

export function DaySelector({ selectedDay, onSelectDay, className = "" }: DaySelectorProps) {
  const { t } = useLanguage();
  // Get current day for highlighting
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
  
  return (
    <div className={`flex overflow-x-auto pb-2 ${className}`}>
      <div className="flex space-x-3 min-w-full p-1">
        {DAYS_OF_WEEK.map((day) => {
          // Skip 'other' category in the day selector
          if (day === 'other') return null;
          
          const isSelected = day === selectedDay;
          const isToday = day === today;
          
          return (
            <Button
              key={day}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`
                min-w-[90px] flex-shrink-0 font-medium shadow-sm transition-all duration-200 rounded-full
                ${isSelected ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white border-transparent transform hover:scale-105' : ''}
                ${isToday && !isSelected ? 'border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800' : ''}
                ${!isToday && !isSelected ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
              `}
              onClick={() => onSelectDay(day)}
            >
              {isToday && (
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
              )}
              {t[day as keyof typeof t]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
