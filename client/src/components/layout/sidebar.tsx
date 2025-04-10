import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ThemeLanguageControls } from "@/components/layout/theme-language-controls";
import { useLanguage } from "@/lib/i18n/language-context";

export default function Sidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t.weeklySchedule, path: "/", icon: "calendar" },
    { name: t.search, path: "/search", icon: "search" },
    { name: t.popular, path: "/popular", icon: "fire" },
    { name: t.genres, path: "/genres", icon: "tag" },
    { name: t.myList, path: "/my-list", icon: "bookmark" },
    { name: t.about, path: "/about", icon: "info" },
  ];
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">AnimeCalendar</h1>
            </div>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path} className={cn(
                "flex items-center px-2 py-3 text-sm font-medium rounded-md group",
                isActive
                  ? "text-white bg-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}>
                <span className="mr-3 text-lg">
                  {item.icon === 'calendar' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  )}
                  {item.icon === 'fire' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5,16 C8.5,16 1,15 1,7 C1,7 8,3 6,14 C6,14 10,9 8,2 C8,2 16,4 15,12 C15,12 18,10 18,6 C18,6 23,10 22,18 C21,22 12,22 8.5,16 Z"></path>
                    </svg>
                  )}
                  {item.icon === 'tag' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                  )}
                  {item.icon === 'bookmark' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  )}
                  {item.icon === 'search' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  )}
                  {item.icon === 'info' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  )}
                </span>
                <span>{item.name}</span>
              </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 p-4 mt-auto border-t border-gray-200">
            {/* Theme and Language Controls */}
            <div className="flex items-center justify-between mb-4">
              <ThemeLanguageControls />
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Data provided by</p>
              <a 
                href="https://jikan.moe/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-primary hover:underline"
              >
                Jikan API
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
