import useSWR from 'swr'
import { getGlobalData } from '../services/api'

const GlobalStats = () => {
    const { data, error, isLoading } = useSWR('/global', getGlobalData)

    if (error)
        return (
            <div className="flex flex-col gap-0.5">
                <div className="hidden md:flex items-center space-x-6 text-sm">
                    <div className="flex flex-col">
                        <span className="text-crypto-text-muted text-xs">
                            Coins
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-crypto-text-muted text-xs">
                            Exchanges
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-crypto-text-muted text-xs">
                            Market Cap
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-crypto-text-muted text-xs">
                            24h Vol
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-crypto-text-muted text-xs">
                            Dominance
                        </span>
                    </div>
                </div>
                <div className="text-crypto-danger text-sm text-center">
                    Failed to load global stats
                </div>
            </div>
        )

    if (isLoading || !data?.data) {
        return (
            <div className="hidden md:flex items-center space-x-6 text-sm animate-pulse text-transparent">
                <div className="flex flex-col">
                    <span className="text-xs">Coins</span>
                    <div className="h-4 bg-crypto-surface-hover w-12 rounded mt-1"></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs">Exchanges</span>
                    <div className="h-4 bg-crypto-surface-hover w-12 rounded mt-1"></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs">Market Cap</span>
                    <div className="h-4 bg-crypto-surface-hover w-20 rounded mt-1"></div>
                </div>
            </div>
        )
    }

    const stats = data.data

    // Format Helpers
    const formatCompactNumber = (number: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 2,
        }).format(number)
    }

    return (
        <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex flex-col">
                <span className="text-crypto-text-muted text-xs">Coins</span>
                <span className="font-semibold text-crypto-text">
                    {stats.active_cryptocurrencies?.toLocaleString() || '-'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-crypto-text-muted text-xs">
                    Exchanges
                </span>
                <span className="font-semibold text-crypto-text">
                    {stats.markets?.toLocaleString() || '-'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-crypto-text-muted text-xs">
                    Market Cap
                </span>
                <span className="font-semibold text-crypto-primary">
                    $
                    {stats.total_market_cap?.usd
                        ? formatCompactNumber(stats.total_market_cap.usd)
                        : '-'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-crypto-text-muted text-xs">24h Vol</span>
                <span className="font-semibold text-crypto-text">
                    $
                    {stats.total_volume?.usd
                        ? formatCompactNumber(stats.total_volume.usd)
                        : '-'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-crypto-text-muted text-xs">
                    Dominance
                </span>
                <span className="font-semibold text-crypto-text">
                    BTC {stats.market_cap_percentage?.btc?.toFixed(1) || '-'}%
                </span>
            </div>
        </div>
    )
}

export default GlobalStats
