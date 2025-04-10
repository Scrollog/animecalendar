// Language translation keys
export interface TranslationKeys {
  // Common UI elements
  appName: string;
  weeklySchedule: string;
  darkMode: string;
  lightMode: string;
  prev: string;
  next: string;
  noAnimeFound: string;
  noAnimeScheduled: string;
  loading: string;
  error: string;
  shows: string;
  show: string;
  
  // Anime details
  animeDetails: string;
  episodes: string;
  episode: string;
  status: string;
  season: string;
  year: string;
  rating: string;
  score: string;
  synopsis: string;
  backToSchedule: string;
  
  // Season selector
  seasons: string;
  winter: string;
  spring: string;
  summer: string;
  fall: string;
  selectSeason: string;
  selectYear: string;
  apply: string;
  viewing: string;
  search: string;
  
  // Search page
  searchDescription: string;
  searchPlaceholder: string;
  searchResults: string;
  found: string;
  tryDifferentSearch: string;
  manualSearch: string;
  realTimeSearch: string;
  typeToSearch: string;
  realTimeSearchHint: string;
  
  // Popular page
  topAnime: string;
  seasonPopular: string;
  allTimePopular: string;
  showAllTimeTop: string;
  topRated: string;
  anime: string;
  
  // Navigation
  schedule: string;
  popular: string;
  genres: string;
  myList: string;
  about: string;
  
  // Days of week
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  
  // Error messages
  errorLoadingSchedule: string;
  failedToLoad: string;
}

// English translations
export const enUS: TranslationKeys = {
  appName: "Anime Calendar",
  weeklySchedule: "Weekly Schedule",
  darkMode: "Dark Mode",
  lightMode: "Light Mode",
  prev: "Prev",
  next: "Next",
  noAnimeFound: "No anime found",
  noAnimeScheduled: "There are no anime scheduled for this day.",
  loading: "Loading...",
  error: "Error",
  shows: "shows",
  show: "show",
  
  animeDetails: "Anime Details",
  episodes: "Episodes",
  episode: "Episode",
  status: "Status",
  season: "Season",
  year: "Year",
  rating: "Rating",
  score: "Score",
  synopsis: "Synopsis",
  backToSchedule: "Back to Schedule",
  
  // Season selector
  seasons: "Seasons",
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  selectSeason: "Select season",
  selectYear: "Select year",
  apply: "Apply",
  viewing: "Viewing",
  search: "Search",
  
  // Search page
  searchDescription: "Search for anime by title, genre, or keywords",
  searchPlaceholder: "Search for anime...",
  searchResults: "Results",
  found: "found",
  tryDifferentSearch: "Try a different search term",
  manualSearch: "Manual Search",
  realTimeSearch: "Real-time Search",
  typeToSearch: "Type to search automatically...",
  realTimeSearchHint: "Search starts automatically after typing 2 or more characters",
  
  // Popular page
  topAnime: "Top Anime",
  seasonPopular: "Season's Most Popular",
  allTimePopular: "All-Time Popular",
  showAllTimeTop: "Show All-Time Top",
  topRated: "Top Rated",
  anime: "Anime",
  
  // Navigation
  schedule: "Schedule",
  popular: "Popular",
  genres: "Genres",
  myList: "My List",
  about: "About",
  
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  
  errorLoadingSchedule: "Error loading schedule",
  failedToLoad: "Failed to load anime schedule. Please try again later."
};

// Portuguese translations
export const ptBR: TranslationKeys = {
  appName: "Calendário de Anime",
  weeklySchedule: "Programação Semanal",
  darkMode: "Modo Escuro",
  lightMode: "Modo Claro",
  prev: "Anterior",
  next: "Próximo",
  noAnimeFound: "Nenhum anime encontrado",
  noAnimeScheduled: "Não há anime programado para este dia.",
  loading: "Carregando...",
  error: "Erro",
  shows: "animes",
  show: "anime",
  
  animeDetails: "Detalhes do Anime",
  episodes: "Episódios",
  episode: "Episódio",
  status: "Status",
  season: "Temporada",
  year: "Ano",
  rating: "Classificação",
  score: "Pontuação",
  synopsis: "Sinopse",
  backToSchedule: "Voltar para a Programação",
  
  // Season selector
  seasons: "Temporadas",
  winter: "Inverno",
  spring: "Primavera",
  summer: "Verão",
  fall: "Outono",
  selectSeason: "Selecionar temporada",
  selectYear: "Selecionar ano",
  apply: "Aplicar",
  viewing: "Visualizando",
  search: "Buscar",
  
  // Search page
  searchDescription: "Busque por anime pelo título, gênero ou palavras-chave",
  searchPlaceholder: "Buscar anime...",
  searchResults: "Resultados",
  found: "encontrados",
  tryDifferentSearch: "Tente um termo de busca diferente",
  manualSearch: "Busca Manual",
  realTimeSearch: "Busca em Tempo Real",
  typeToSearch: "Digite para buscar automaticamente...",
  realTimeSearchHint: "A busca começa automaticamente após digitar 2 ou mais caracteres",
  
  // Popular page
  topAnime: "Top Anime",
  seasonPopular: "Mais Populares da Temporada",
  allTimePopular: "Mais Populares de Todos os Tempos",
  showAllTimeTop: "Mostrar Top de Todos os Tempos",
  topRated: "Melhor Avaliados",
  anime: "Anime",
  
  // Navigation
  schedule: "Agenda",
  popular: "Popular",
  genres: "Gêneros",
  myList: "Minha Lista",
  about: "Sobre",
  
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
  
  errorLoadingSchedule: "Erro ao carregar programação",
  failedToLoad: "Falha ao carregar a programação de anime. Por favor, tente novamente mais tarde."
};

// Map of available languages
export const translations = {
  'en-US': enUS,
  'pt-BR': ptBR
};

export type LanguageCode = keyof typeof translations;