import { Outlet } from 'react-router-dom'
import { LineChart } from 'lucide-react'
import GlobalStats from './GlobalStats'
import SearchBar from './SearchBar'

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Global Stats Header */}
            <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LineChart className="w-8 h-8 text-crypto-primary" />
                        <span className="text-xl font-bold text-gradient">
                            CryptoDash
                        </span>
                    </div>

                    <GlobalStats />

                    <div className="flex items-center">
                        <SearchBar />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-crypto-text-muted text-sm">
                    Built with React & CoinGecko API
                </div>
            </footer>
        </div>
    )
}

export default Layout
