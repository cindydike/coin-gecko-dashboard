const API_BASE_URL = import.meta.env.VITE_API_URL;

export class DetailedError extends Error {
  info: object;
  status: number

  constructor(message: string, status: number, info: object) {
    super(message)
    this.info = info
    this.status = status
  }
}

export interface TrendingItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

export interface TrendingCoin {
  item: TrendingItem;
}

export interface TrendingNFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  native_price_24h_percentage_change: number;
  floor_price_in_native_currency: number;
  floor_price_24h_percentage_change: number;
}

export interface TrendingCategory {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
}

export interface TrendingResponse {
  coins: TrendingCoin[];
  nfts: TrendingNFT[];
  categories: TrendingCategory[];
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_cap_rank: number;
  description: {
    en: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    fully_diluted_valuation: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
    atl_date: { usd: string };
  };
}

export async function fetcher<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url: URL;
  if (import.meta.env.MODE === "development") {
    url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  } else {
    url = new URL(`${API_BASE_URL}${endpoint}`);
  }
  
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }
  
  try {
     const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    try {
      const info = await response.json()
      const status = response.status
      const error = new DetailedError(`API error: ${response.status} ${response.statusText}`, status, info);
      throw error
    } catch {
      throw new DetailedError(`API error: ${response.status} ${response.statusText}`, response.status, {});
    } 
  }

  const data = await response.json();

  console.log(`Fetched for ${endpoint}:`, data)
  
  return data as T;
    
  } catch (error) {
    if (error instanceof DetailedError) {
      throw error
    }
    console.log(`Network error for ${endpoint}:`, error)
    throw error
  }
 
}

// Global Stats
export const getGlobalData = () => {
  return fetcher<{
    data: {
      active_cryptocurrencies: number;
      markets: number;
      total_market_cap: Record<string, number>;
      total_volume: Record<string, number>;
      market_cap_percentage: Record<string, number>;
    };
  }>('/global');
};

// Top coins by market cap
export const getMarkets = (page = 1, perPage = 50) => {
  return fetcher<CoinMarket[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d'
  });
};

// Coin details
export const getCoinDetails = (id: string) => {
  const params = {
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false'
  }
  return fetcher<CoinDetails>(`/coins/${id}`, params);
};

// Coin historical chart data
export const getCoinChart = (id: string, days = '7') => {
  const params = {
    vs_currency: 'usd',
    days: days
  }
  return fetcher<{
    prices: number[][], market_caps: number[][], total_volumes: number[][]
  }>(`/coins/${id}/market_chart`, params);
};

// Trending search
export const getTrending = () => {
  return fetcher<TrendingResponse>('/search/trending');
};
