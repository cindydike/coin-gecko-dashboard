import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { getCoinDetails, getCoinChart } from '../services/api'
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

// Time intervals for the chart
const timeRanges = [
    { label: '24H', value: '1' },
    { label: '7D', value: '7' },
    { label: '14D', value: '14' },
    { label: '30D', value: '30' },
    { label: '1Y', value: '365' },
]

const CoinDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [days, setDays] = useState('7')

    const {
        data: coin,
        error: coinError,
        isLoading: loadingCoin,
    } = useSWR(id ? `/coins/${id}` : null, () => getCoinDetails(id!))
    const { data: chartData, isLoading: loadingChart } = useSWR(
        id ? `/coins/${id}/market_chart?days=${days}` : null,
        () => getCoinChart(id!, days)
    )

    if (coinError) {
        return (
            <div className="glass-panel p-8 text-center text-crypto-danger">
                <p>Failed to load coin data.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-crypto-surface hover:bg-crypto-surface-hover rounded-lg transition-colors border border-crypto-border"
                >
                    Go Back
                </button>
            </div>
        )
    }

    if (loadingCoin || !coin) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-crypto-primary" />
            </div>
        )
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: value < 1 ? 4 : 2,
        }).format(value)
    }

    const isPositive24h = coin.market_data.price_change_percentage_24h >= 0

    // Format chart data
    const formattedChartData =
        chartData?.prices.map(([timestamp, price]) => ({
            date:
                new Date(timestamp).toLocaleDateString() +
                ' ' +
                new Date(timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            price: price,
        })) || []

    return (
        <div className="space-y-6">
            {/* Header & Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-crypto-text-muted hover:text-crypto-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={coin.image.large}
                                    alt={coin.name}
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-3xl font-bold">
                                            {coin.name}
                                        </h1>
                                        <span className="px-2 py-1 bg-crypto-surface rounded border border-crypto-border text-xs uppercase text-crypto-text-muted">
                                            {coin.symbol}
                                        </span>
                                        <span className="px-2 py-1 bg-crypto-accent/20 text-crypto-accent rounded text-xs font-semibold">
                                            Rank #{coin.market_cap_rank}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-3xl font-semibold">
                                            {formatCurrency(
                                                coin.market_data.current_price
                                                    .usd
                                            )}
                                        </span>
                                        <span
                                            className={`flex items-center font-medium ${isPositive24h ? 'text-crypto-success' : 'text-crypto-danger'}`}
                                        >
                                            {isPositive24h ? (
                                                <ArrowUpRight className="w-5 h-5" />
                                            ) : (
                                                <ArrowDownRight className="w-5 h-5" />
                                            )}
                                            {Math.abs(
                                                coin.market_data
                                                    .price_change_percentage_24h
                                            ).toFixed(2)}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Time Range Selector */}
                            <div className="flex bg-crypto-surface rounded-lg p-1 border border-crypto-border">
                                {timeRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => setDays(range.value)}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                            days === range.value
                                                ? 'bg-crypto-primary text-white shadow-md'
                                                : 'text-crypto-text-muted hover:text-crypto-text hover:bg-crypto-surface-hover'
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-[400px] w-full">
                            {loadingChart ? (
                                <div className="h-full w-full flex justify-center items-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-crypto-primary" />
                                </div>
                            ) : (
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                    initialDimension={{
                                        width: 1000,
                                        height: 400,
                                    }}
                                >
                                    <AreaChart data={formattedChartData}>
                                        <defs>
                                            <linearGradient
                                                id="colorPrice"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--color-crypto-primary)"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--color-crypto-primary)"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.05)"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            hide={true} // Hide complex labels for cleaner UI, rely on tooltip
                                        />
                                        <YAxis
                                            domain={['auto', 'auto']}
                                            tickFormatter={(value) =>
                                                `$${value.toLocaleString()}`
                                            }
                                            width={80}
                                            stroke="var(--color-crypto-text-muted)"
                                            tick={{
                                                fill: 'var(--color-crypto-text-muted)',
                                                fontSize: 12,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'var(--color-crypto-surface)',
                                                border: '1px solid var(--color-crypto-border)',
                                                borderRadius: '8px',
                                            }}
                                            itemStyle={{
                                                color: 'var(--color-crypto-primary)',
                                            }}
                                            labelStyle={{
                                                color: 'var(--color-crypto-text-muted)',
                                                marginBottom: '4px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="var(--color-crypto-primary)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                            isAnimationActive={true}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Market Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between pb-3 border-b border-white/5">
                                <span className="text-crypto-text-muted">
                                    Market Cap
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(
                                        coin.market_data.market_cap.usd
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-white/5">
                                <span className="text-crypto-text-muted">
                                    Fully Diluted Valuation
                                </span>
                                <span className="font-medium">
                                    {coin.market_data.fully_diluted_valuation
                                        ?.usd
                                        ? formatCurrency(
                                              coin.market_data
                                                  .fully_diluted_valuation.usd
                                          )
                                        : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-white/5">
                                <span className="text-crypto-text-muted">
                                    24h Trading Vol
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(
                                        coin.market_data.total_volume.usd
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-white/5">
                                <span className="text-crypto-text-muted">
                                    Circulating Supply
                                </span>
                                <span className="font-medium">
                                    {coin.market_data.circulating_supply.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-white/5">
                                <span className="text-crypto-text-muted">
                                    Total Supply
                                </span>
                                <span className="font-medium">
                                    {coin.market_data.total_supply?.toLocaleString() ||
                                        '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-crypto-text-muted">
                                    Max Supply
                                </span>
                                <span className="font-medium">
                                    {coin.market_data.max_supply?.toLocaleString() ||
                                        '∞'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Historical Data
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between pb-3 border-b border-white/5">
                                <span className="text-crypto-text-muted w-1/3">
                                    All-Time High
                                </span>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">
                                        {formatCurrency(
                                            coin.market_data.ath.usd
                                        )}
                                    </span>
                                    <span
                                        className={`text-xs ${coin.market_data.ath_change_percentage.usd >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}
                                    >
                                        {coin.market_data.ath_change_percentage.usd.toFixed(
                                            2
                                        )}
                                        %
                                    </span>
                                    <span className="text-xs text-crypto-text-muted">
                                        {new Date(
                                            coin.market_data.ath_date.usd
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-crypto-text-muted w-1/3">
                                    All-Time Low
                                </span>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">
                                        {formatCurrency(
                                            coin.market_data.atl.usd
                                        )}
                                    </span>
                                    <span
                                        className={`text-xs ${coin.market_data.atl_change_percentage.usd >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}
                                    >
                                        {coin.market_data.atl_change_percentage.usd.toFixed(
                                            2
                                        )}
                                        %
                                    </span>
                                    <span className="text-xs text-crypto-text-muted">
                                        {new Date(
                                            coin.market_data.atl_date.usd
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            {coin.description?.en && (
                <div className="glass-panel p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-4">
                        What is {coin.name}?
                    </h3>
                    <div
                        className="text-crypto-text-muted prose prose-invert max-w-none text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: coin.description.en,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default CoinDetails
