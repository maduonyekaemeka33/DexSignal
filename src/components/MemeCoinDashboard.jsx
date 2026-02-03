import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function MemeCoinDashboard() {
  const [coins, setCoins] = useState([]);
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "shiba-inu,dogecoin,pepecoin",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(response.data);
        setSelectedCoin(response.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoins();
  }, []);

  const simulateProfit = () => {
    if (!selectedCoin) return 0;
    const potentialGain = tradeAmount * (selectedCoin.price_change_percentage_24h / 100);
    return potentialGain.toFixed(2);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-neon">Meme Coin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {coins.map((coin) => (
          <div key={coin.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg">{coin.name}</h2>
              {coin.price_change_percentage_24h > 0 ? (
                <FaArrowUp className="text-green-400" />
              ) : (
                <FaArrowDown className="text-red-500" />
              )}
            </div>
            <p>Price: ${coin.current_price.toLocaleString()}</p>
            <p>24h: {coin.price_change_percentage_24h.toFixed(2)}%</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Profit Simulator</h2>
        <div className="mb-4">
          <label className="block mb-2">Select Coin</label>
          <select
            className="p-2 rounded w-full bg-gray-800"
            onChange={(e) =>
              setSelectedCoin(coins.find((c) => c.id === e.target.value))
            }
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Trade Amount (USD)</label>
          <input
            type="number"
            className="p-2 rounded w-full bg-gray-800"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <p>
            Potential 24h Profit: <span className="font-bold">${simulateProfit()}</span>
          </p>
        </div>
      </div>

      <div className="text-center">
        <button className="bg-neon text-black font-bold px-6 py-3 rounded hover:bg-green-500 transition">
          Connect Wallet & Swap
        </button>
      </div>
    </div>
  );
}

export default MemeCoinDashboard;
