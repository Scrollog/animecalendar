import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AnimeDetails from "@/pages/anime-details";
import SearchPage from "@/pages/search";
import PopularPage from "@/pages/popular";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { ThemeLanguageControls } from "@/components/layout/theme-language-controls";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/anime/:id" component={AnimeDetails} />
      <Route path="/search" component={SearchPage} />
      <Route path="/popular" component={PopularPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  // Close mobile menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Sidebar (desktop) */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 w-0 overflow-hidden">
            <div className="relative z-10 flex md:hidden flex-shrink-0 h-16 bg-white border-b border-gray-200">
              <div className="flex-1 flex justify-between px-4">
                <div className="flex-1 flex items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                        <polyline points="17 2 12 7 7 2" />
                      </svg>
                    </div>
                    <h1 className="ml-2 text-lg font-bold text-gray-900">AnimeCalendar</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ThemeLanguageControls />
                  <button 
                    type="button" 
                    className="p-2 text-gray-500 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMobileMenu();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <Router />
            </main>
            
            <MobileNav />
          </div>
        </div>
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
