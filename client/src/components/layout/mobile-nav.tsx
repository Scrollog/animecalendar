import { Link, useLocation } from "wouter";
import { Calendar, Search, Flame, Tag, Bookmark, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function MobileNav() {
  const [location] = useLocation();
  const { t } = useLanguage();
  
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200">
      <div className="grid grid-cols-5 h-16">
        <Link href="/" className={`flex flex-col items-center justify-center ${location === '/' ? 'text-primary' : 'text-gray-500'}`}>
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">{t.schedule || "Schedule"}</span>
        </Link>
        
        <Link href="/search" className={`flex flex-col items-center justify-center ${location === '/search' ? 'text-primary' : 'text-gray-500'}`}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">{t.search}</span>
        </Link>
        
        <Link href="/popular" className={`flex flex-col items-center justify-center ${location === '/popular' ? 'text-primary' : 'text-gray-500'}`}>
            <Flame className="h-5 w-5" />
            <span className="text-xs mt-1">{t.popular || "Popular"}</span>
        </Link>
        
        <Link href="/genres" className={`flex flex-col items-center justify-center ${location === '/genres' ? 'text-primary' : 'text-gray-500'}`}>
            <Tag className="h-5 w-5" />
            <span className="text-xs mt-1">{t.genres || "Genres"}</span>
        </Link>
        
        <Link href="/my-list" className={`flex flex-col items-center justify-center ${location === '/my-list' ? 'text-primary' : 'text-gray-500'}`}>
            <Bookmark className="h-5 w-5" />
            <span className="text-xs mt-1">{t.myList || "My List"}</span>
        </Link>
      </div>
    </div>
  );
}
