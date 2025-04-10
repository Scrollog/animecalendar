import { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n/language-context";

// Define valid seasons
const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type SeasonType = typeof SEASONS[number];

// Generate array of years (from 2000 to current year)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i);

interface SeasonSelectorProps {
  onSelectSeason: (year: number, season: SeasonType) => void;
  className?: string;
}

export function SeasonSelector({ onSelectSeason, className = "" }: SeasonSelectorProps) {
  const { t } = useLanguage();
  
  // Get current season and year
  const getCurrentSeason = (): { season: SeasonType, year: number } => {
    const now = new Date();
    const monthIndex = now.getMonth();
    let seasonIndex = Math.floor(monthIndex / 3);
    const year = now.getFullYear();
    return { season: SEASONS[seasonIndex], year };
  };
  
  const { season: currentSeason, year: currentYear } = getCurrentSeason();
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>(currentSeason);
  
  const handleYearChange = (year: string) => {
    const parsedYear = parseInt(year);
    setSelectedYear(parsedYear);
  };
  
  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season as SeasonType);
  };
  
  const handleApply = () => {
    onSelectSeason(selectedYear, selectedSeason);
  };
  
  const getCurrentSeasonLabel = () => {
    return `${t[selectedSeason]} ${selectedYear}`;
  };
  
  return (
    <div className={`flex flex-col md:flex-row gap-4 items-center ${className}`}>
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t.season}:</span>
        <div className="flex items-center gap-3">
          <Select value={selectedSeason} onValueChange={handleSeasonChange}>
            <SelectTrigger className="w-[140px] backdrop-blur-sm bg-opacity-90 shadow-md border-gray-300 dark:border-gray-700 rounded-lg">
              <SelectValue placeholder={t.selectSeason} />
            </SelectTrigger>
            <SelectContent className="border-gray-300 dark:border-gray-700 shadow-lg">
              <SelectGroup>
                <SelectLabel className="font-medium">{t.seasons}</SelectLabel>
                {SEASONS.map((season) => (
                  <SelectItem key={season} value={season} className="capitalize">
                    {t[season]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px] backdrop-blur-sm bg-opacity-90 shadow-md border-gray-300 dark:border-gray-700 rounded-lg">
              <SelectValue placeholder={t.selectYear} />
            </SelectTrigger>
            <SelectContent className="h-[300px] border-gray-300 dark:border-gray-700 shadow-lg">
              <SelectGroup>
                <SelectLabel className="font-medium">{t.year}</SelectLabel>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button 
            variant="default"
            className="h-10 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 rounded-lg"
            onClick={handleApply}
          >
            {t.apply}
          </Button>
        </div>
      </div>
    </div>
  );
}