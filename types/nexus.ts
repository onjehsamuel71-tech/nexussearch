export interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  timestamp: string;
  region: string;
}

export interface HistoryEntry {
  id: string;
  query: string;
  region: string;
  timestamp: string;
}

export interface BookmarkEntry {
  id: string;
  title: string;
  domain: string;
  url: string;
  timestamp: string;
}