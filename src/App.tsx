import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CoinDetails from './pages/CoinDetails';
import { SWRConfig } from 'swr'
import { DetailedError } from './services/api.ts'

function App() {
  return (
    <SWRConfig value={{
      errorRetryCount: 3,
      onError(err: DetailedError, key) {
        console.log(`Fetch error: ${key}`, {
          message: err.message,
          status: err.status,
          info: err.info
        })
      },
      shouldRetryOnError(err: DetailedError) {
        if (err.status === 404) return false
        return true
      }
    }}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="coin/:id" element={<CoinDetails />} />
        </Route>
      </Routes>
    </Router>
    </SWRConfig>
  );
}

export default App;
