import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";

export function ThemeLanguageControls() {
  return (
    <div className="flex items-center space-x-2">
      <ThemeToggle />
      <LanguageSelector />
    </div>
  );
}