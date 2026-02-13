import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  container: {
    animation: "fadeIn 0.3s ease-out",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "24px",
    textAlign: "center",
    color: "var(--foreground)",
  },
  titleAccent: {
    color: "var(--primary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  coinCard: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px",
    transition: "border-color 0.2s",
  },
  coinHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  coinName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--foreground)",
  },
  arrow: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
  arrowUp: {
    background: "rgba(34, 197, 94, 0.15)",
    color: "var(--primary)",
  },
  arrowDown: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "var(--destructive)",
  },
  coinPrice: {
    fontSize: "14px",
    color: "var(--foreground-muted)",
    marginBottom: "4px",
  },
  coinChange: {
    fontSize: "14px",
    fontWeight: "600",
  },
  simulatorCard: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
  },
  simulatorTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--foreground)",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "var(--foreground-muted)",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  profitText: {
    fontSize: "16px",
    color: "var(--foreground)",
  },
  profitValue: {
    fontWeight: "700",
    color: "var(--primary)",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "var(--foreground-muted)",
    fontSize: "14px",
  },
};

function MemeCoinDashboard() {
  const [coins, setCoins] = useState([]);
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "shiba-inu,dogecoin,pepe,bonk,floki-inu,dogwifcoin",
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
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const simulateProfit = () => {
    if (!selectedCoin) return 0;
    const potentialGain = tradeAmount * (selectedCoin.price_change_percentage_24h / 100);
    return potentialGain.toFixed(2);
  };

  if (loading) {
    return (
      <div style={styles.emptyState}>
        <span className="spinner" />
        <p style={{ marginTop: "12px" }}>Loading market data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Meme Coin <span style={styles.titleAccent}>Dashboard</span>
      </h1>

      <div style={styles.grid}>
        {coins.map((coin) => (
          <div
            key={coin.id}
            style={styles.coinCard}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={styles.coinHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={`${coin.name} logo`}
                    style={{ width: "28px", height: "28px", borderRadius: "50%" }}
                    crossOrigin="anonymous"
                  />
                )}
                <span style={styles.coinName}>{coin.name}</span>
              </div>
              <div
                style={{
                  ...styles.arrow,
                  ...(coin.price_change_percentage_24h > 0 ? styles.arrowUp : styles.arrowDown),
                }}
              >
                {coin.price_change_percentage_24h > 0 ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2l4 6H2z" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 10l4-6H2z" />
                  </svg>
                )}
              </div>
            </div>
            <p style={styles.coinPrice}>
              Price: ${coin.current_price < 0.01
                ? coin.current_price.toFixed(8)
                : coin.current_price.toLocaleString()}
            </p>
            <p
              style={{
                ...styles.coinChange,
                color:
                  coin.price_change_percentage_24h > 0
                    ? "var(--primary)"
                    : "var(--destructive)",
              }}
            >
              24h: {coin.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      <div style={styles.simulatorCard}>
        <h2 style={styles.simulatorTitle}>Profit Simulator</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Coin</label>
          <select
            style={styles.select}
            onChange={(e) =>
              setSelectedCoin(coins.find((c) => c.id === e.target.value))
            }
            value={selectedCoin?.id || ""}
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Trade Amount (USD)</label>
          <input
            type="number"
            style={styles.input}
            value={tradeAmount}
            onChange={(e) => setTradeAmount(Number(e.target.value))}
          />
        </div>
        <p style={styles.profitText}>
          Potential 24h Profit:{" "}
          <span
            style={{
              ...styles.profitValue,
              color:
                parseFloat(simulateProfit()) >= 0
                  ? "var(--primary)"
                  : "var(--destructive)",
            }}
          >
            ${simulateProfit()}
          </span>
        </p>
      </div>
    </div>
  );
}

export default MemeCoinDashboard;
