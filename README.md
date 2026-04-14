# 🪙 CoinGecko Dashboard

A high-performance, premium cryptocurrency dashboard that provides real-time market data, trending insights, and detailed coin analytics. Built with a modern, glassmorphic UI using React 19 and the CoinGecko API.

## ✨ Features

- **🌍 Global Market Stats**: Instant overview of total market capitalization, 24h trading volume, and Bitcoin dominance.
- **🔥 Trending Coins**: Discover what's hot with real-time trending data directly from CoinGecko.
- **📊 Interactive Coin Table**: Responsive ranking of top cryptocurrencies featuring:
  - Dynamic price tracking (1h, 24h, 7d changes).
  - Small-scale sparkline charts for quick visual trend analysis.
  - High-performance sorting and pagination via **TanStack Table**.
- **📈 Detailed Analytics**: Dedicated pages for every coin with:
  - Customizable **Recharts** price history (24H, 7D, 30D, 1Y).
  - Comprehensive market metrics (ATH, ATL, Circulating Supply, etc.).
  - Rich descriptive content.
- **🔍 Smart SearchBar**: Quick search functionality to find and navigate to specific assets.
- **⚡ Performance First**:
  - **SWR Integration**: Efficient data fetching with caching and revalidation.
  - **Vite Proxy**: Seamless development workflow with proxied API requests.
  - **Glassmorphic UI**: Premium aesthetics with a responsive, state-of-the-art design.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Tables**: [TanStack Table v8](https://tanstack.com/table/latest)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Bun](https://bun.sh/) (Optional, but recommended for scripts)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/cindydike/coin-gecko-dashboard.git
    cd coin-gecko-dashboard
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # or
    bun install
    ```

3. **Run the development server**:

    ```bash
    npm run dev
    ```

4. **Open the application**:
    Navigate to `http://localhost:5173` in your browser.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Table, SearchBar, Stats)
├── pages/          # Full page views (Home, CoinDetails)
├── services/       # API wrapper, fetcher, and TypeScript interfaces
├── App.tsx         # Main application shell & routing
├── index.css       # Global styles & Tailwind entry
└── main.tsx        # React entry point
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Cindy Dike](https://github.com/cindydike)
