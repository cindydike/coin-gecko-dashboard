import CoinTable from '../components/CoinTable';

const Home = () => {
  return (
    <div className="space-y-8">
      <div className="glass-panel p-6">
        <h1 className="text-2xl font-semibold mb-2">Cryptocurrency Prices by Market Cap</h1>
        <p className="text-crypto-text-muted">Explore the top cryptocurrencies ranked by their total market capitalization.</p>
      </div>
      
      <CoinTable />
    </div>
  );
};

export default Home;
