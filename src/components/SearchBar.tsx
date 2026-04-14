import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import { getTrending } from '../services/api';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: trending, isLoading } = useSWR(isOpen ? '/search/trending' : null, getTrending);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCoin = (coinId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/coin/${coinId}`);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div 
        className={`flex items-center bg-crypto-surface border transition-colors rounded-lg px-3 py-1.5 w-64 ${isOpen ? 'border-crypto-primary bg-crypto-surface-hover' : 'border-crypto-border'}`}
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4 text-crypto-text-muted mr-2" />
        <input 
          type="text"
          placeholder="Search coins..."
          className="bg-transparent border-none outline-none text-sm text-crypto-text w-full placeholder-crypto-text-muted"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 right-0 glass-panel max-h-[400px] overflow-y-auto z-50 p-2">
          {query.length > 0 ? (
            <div className="p-4 text-center text-sm text-crypto-text-muted">
              Press enter to search for "{query}"... (Note: Full search requires a different endpoint)
            </div>
          ) : (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-crypto-text-muted uppercase tracking-wider">
                🔥 Trending Coins
              </div>
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-crypto-primary" /></div>
              ) : trending?.coins?.length ? (
                <div className="space-y-1">
                  {trending.coins.slice(0, 5).map(({ item }) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectCoin(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.thumb} alt={item.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-crypto-text-muted">{item.symbol}</span>
                      </div>
                      <span className="text-xs text-crypto-success">#{item.market_cap_rank}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-crypto-text-muted">No trending coins found.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
