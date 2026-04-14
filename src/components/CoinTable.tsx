import { useState } from 'react'
import useSWR from 'swr'
import { getMarkets, type CoinMarket } from '../services/api'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'

const columnHelper = createColumnHelper<CoinMarket>()

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value)
}

const formatPercentage = (value: number) => {
    if (value == null) return '-'
    const isPositive = value >= 0
    return (
        <span
            className={`flex items-center ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}
        >
            {isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {Math.abs(value).toFixed(2)}%
        </span>
    )
}

const Sparkline = ({
    data,
    isPositive,
}: {
    data: number[]
    isPositive: boolean
}) => {
    if (!data || !data.length) return <div>-</div>
    const chartData = data.map((price, index) => ({ price, index }))
    const color = isPositive
        ? 'var(--color-crypto-success)'
        : 'var(--color-crypto-danger)'

    return (
        <div className="h-12 w-32">
            <ResponsiveContainer
                width="100%"
                height="100%"
                initialDimension={{ width: 128, height: 48 }}
            >
                <LineChart data={chartData}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

const columns = [
    columnHelper.accessor('market_cap_rank', {
        header: '#',
        cell: (info) => (
            <span className="text-crypto-text-muted">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('name', {
        header: 'Coin',
        cell: (info) => {
            const coin = info.row.original
            return (
                <div className="flex items-center gap-3">
                    <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold">{coin.name}</span>
                        <span className="text-xs text-crypto-text-muted uppercase">
                            {coin.symbol}
                        </span>
                    </div>
                </div>
            )
        },
    }),
    columnHelper.accessor('current_price', {
        header: 'Price',
        cell: (info) => (
            <span className="font-medium">
                {formatCurrency(info.getValue())}
            </span>
        ),
    }),
    columnHelper.accessor('price_change_percentage_1h_in_currency', {
        header: '1h %',
        cell: (info) => formatPercentage(info.getValue()),
    }),
    columnHelper.accessor('price_change_percentage_24h_in_currency', {
        header: '24h %',
        cell: (info) => formatPercentage(info.getValue()),
    }),
    columnHelper.accessor('price_change_percentage_7d_in_currency', {
        header: '7d %',
        cell: (info) => formatPercentage(info.getValue()),
    }),
    columnHelper.accessor('market_cap', {
        header: 'Market Cap',
        cell: (info) => `${formatCurrency(info.getValue()).split('.')[0]}`,
    }),
    columnHelper.accessor('sparkline_in_7d', {
        header: 'Last 7 Days',
        cell: (info) => {
            const isPositive =
                info.row.original.price_change_percentage_7d_in_currency >= 0
            return (
                <Sparkline
                    data={info.getValue()?.price || []}
                    isPositive={isPositive}
                />
            )
        },
    }),
]

const CoinTable = () => {
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const {
        data: coins,
        error,
        isLoading,
    } = useSWR(['/coins/markets', page], () => getMarkets(page, 100))

    const table = useReactTable({
        data: coins || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (error)
        return (
            <div className="text-crypto-danger p-4 glass-panel">
                Failed to load market data: {error.message}
            </div>
        )

    return (
        <div className="space-y-4">
            <div className="glass-panel overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="border-b border-white/5"
                            >
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="py-4 px-6 text-sm font-medium text-crypto-text-muted"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading
                            ? Array.from({ length: 10 }).map((_, i) => (
                                  <tr
                                      key={i}
                                      className="border-b border-white/5 animate-pulse text-transparent"
                                  >
                                      <td className="py-4 px-6">
                                          <div className="h-4 bg-crypto-surface-hover rounded w-8"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-8 bg-crypto-surface-hover rounded w-32"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-4 bg-crypto-surface-hover rounded w-16"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-4 bg-crypto-surface-hover rounded w-16"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-4 bg-crypto-surface-hover rounded w-16"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-4 bg-crypto-surface-hover rounded w-16"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-4 bg-crypto-surface-hover rounded w-24"></div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <div className="h-8 bg-crypto-surface-hover rounded w-32"></div>
                                      </td>
                                  </tr>
                              ))
                            : table.getRowModel().rows.map((row) => (
                                  <tr
                                      key={row.id}
                                      className="border-b border-white/5 glass-panel-hover cursor-pointer"
                                      onClick={() =>
                                          navigate(`/coin/${row.original.id}`)
                                      }
                                  >
                                      {row.getVisibleCells().map((cell) => (
                                          <td
                                              key={cell.id}
                                              className="py-4 px-6 text-sm"
                                          >
                                              {flexRender(
                                                  cell.column.columnDef.cell,
                                                  cell.getContext()
                                              )}
                                          </td>
                                      ))}
                                  </tr>
                              ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-crypto-surface border border-crypto-border rounded-lg text-sm hover:bg-crypto-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <span className="text-crypto-text-muted text-sm">
                    Page {page}
                </span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-crypto-surface border border-crypto-border rounded-lg text-sm hover:bg-crypto-surface-hover transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default CoinTable
