import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JikanAnime } from '@shared/schema';
import { AnimeCard, AnimeCardSkeleton } from '@/components/anime-card';
import { useLanguage } from '@/lib/i18n/language-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SearchPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [realTimeQuery, setRealTimeQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'manual' | 'realtime'>('manual');
  
  // Debounce the real-time search input
  useEffect(() => {
    if (searchType !== 'realtime') return;
    
    // Clear previous results when query changes
    if (realTimeQuery.trim().length < 2) {
      setDebouncedQuery('');
    }
    
    const handler = setTimeout(() => {
      if (realTimeQuery.trim().length >= 2) {
        setDebouncedQuery(realTimeQuery.trim());
      }
    }, 500); // 500ms debounce delay
    
    return () => {
      clearTimeout(handler);
    };
  }, [realTimeQuery, searchType]);

  // Actual search query
  const { 
    data: searchResults, 
    isLoading, 
    isError, 
    error 
  } = useQuery<{ data: JikanAnime[] }>({
    queryKey: ['search', debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [_, query] = queryKey;
      if (!query || typeof query !== 'string' || query.length < 2) {
        return { data: [] };
      }
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }
        const result = await response.json();
        
        // Make sure we return the right format even if API response structure is different
        return { data: result.data || [] };
      } catch (err) {
        console.error('Search error:', err);
        throw new Error('Failed to search anime. Please try again.');
      }
    },
    enabled: debouncedQuery.length > 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle search form submission for manual search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    setDebouncedQuery(searchQuery.trim());
    setIsSearching(false);
  };

  // If there's a search query but no results yet
  const isLoadingResults = isSearching || (debouncedQuery.length > 1 && isLoading);

  // Get anime list from results
  const animeList = searchResults?.data || [];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSearchType(value as 'manual' | 'realtime');
    
    // Clear the debounced query to reset the search results
    setDebouncedQuery('');
    
    // Reset queries when switching tabs
    if (value === 'manual') {
      setRealTimeQuery('');
      // Transfer the last search if there was one
      if (debouncedQuery && searchQuery !== debouncedQuery) {
        setSearchQuery(debouncedQuery);
      }
    } else {
      // Transfer the last search if there was one
      if (debouncedQuery) {
        setRealTimeQuery(debouncedQuery);
      }
    }
  };

  return (
    <div className="py-6 pb-20 md:pb-6">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
              {t.search}
            </span>
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t.searchDescription}
          </p>
        </div>

        {/* Search Tabs */}
        <Tabs defaultValue="manual" className="mb-8" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <SearchIcon className="h-4 w-4" />
              {t.manualSearch || 'Manual Search'}
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t.realTimeSearch || 'Real-time Search'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            {/* Manual Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Button 
                  type="submit" 
                  disabled={searchQuery.trim().length < 2 || isLoadingResults}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md transition-all duration-200 ease-in-out"
                >
                  {isLoadingResults ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <SearchIcon className="h-4 w-4 mr-2" />
                  )}
                  {t.search}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="realtime">
            {/* Real-time Search Input */}
            <div className="mb-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t.typeToSearch || "Type to search automatically..."}
                  className="pl-10"
                  value={realTimeQuery}
                  onChange={(e) => setRealTimeQuery(e.target.value)}
                />
                <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                {isLoadingResults && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-orange-500" />
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t.realTimeSearchHint || "Search starts automatically after typing 2 or more characters"}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Search Results */}
        <div className="mb-8">
          {debouncedQuery.length > 1 && (
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t.searchResults}: {debouncedQuery}
              </h3>
              {!isLoadingResults && animeList.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {animeList.length} {animeList.length === 1 ? t.show : t.shows} {t.found}
                </p>
              )}
            </div>
          )}

          {isLoadingResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
              <strong className="font-bold">{t.error}: </strong>
              <span className="block sm:inline">{error instanceof Error ? error.message : t.failedToLoad}</span>
            </div>
          ) : debouncedQuery.length > 1 && animeList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {animeList.map((anime: JikanAnime, index: number) => (
                <AnimeCard key={`${searchType}-${debouncedQuery}-${anime.mal_id}-${index}`} anime={anime} />
              ))}
            </div>
          ) : debouncedQuery.length > 1 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t.noAnimeFound}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t.tryDifferentSearch}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}