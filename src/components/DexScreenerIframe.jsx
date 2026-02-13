import React, { useState } from "react";

const chains = [
  { id: "solana", label: "Solana" },
  { id: "ethereum", label: "Ethereum" },
  { id: "bsc", label: "BNB Chain" },
  { id: "polygon", label: "Polygon" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "base", label: "Base" },
];

const styles = {
  container: {
    animation: "fadeIn 0.3s ease-out",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "20px",
    textAlign: "center",
    color: "var(--foreground)",
  },
  titleAccent: {
    color: "var(--primary)",
  },
  chainBar: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  chainBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--background-card)",
    color: "var(--foreground-muted)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  chainBtnActive: {
    background: "var(--primary-muted)",
    borderColor: "var(--primary)",
    color: "var(--primary)",
    fontWeight: "600",
  },
  iframeWrapper: {
    borderRadius: "var(--radius)",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
};

function DexScreenerIframe() {
  const [chain, setChain] = useState("solana");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Live <span style={styles.titleAccent}>Charts</span>
      </h2>

      <div style={styles.chainBar}>
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => setChain(c.id)}
            style={{
              ...styles.chainBtn,
              ...(chain === c.id ? styles.chainBtnActive : {}),
            }}
            onMouseEnter={(e) => {
              if (chain !== c.id) e.target.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              if (chain !== c.id) e.target.style.color = "var(--foreground-muted)";
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={styles.iframeWrapper}>
        <iframe
          title="DexScreener Charts"
          src={`https://dexscreener.com/${chain}`}
          width="100%"
          height="700"
          style={{ border: "none", display: "block" }}
        />
      </div>
    </div>
  );
}

export default DexScreenerIframe;
