import React, { useState } from "react";

function DexScreenerIframe() {
  const [chain, setChain] = useState("solana");
  const [showSwap, setShowSwap] = useState(false);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-neon">
        DexScreener Live Charts
      </h2>

      <div className="flex gap-2 justify-center mb-4">
        <button onClick={() => setChain("solana")} className="px-4 py-2 bg-gray-800 text-white rounded">
          Solana
        </button>
        <button onClick={() => setChain("ethereum")} className="px-4 py-2 bg-gray-800 text-white rounded">
          Ethereum
        </button>
        <button onClick={() => setShowSwap(true)} className="px-4 py-2 bg-green-500 text-black rounded">
          Swap
        </button>
      </div>

      <iframe
        id="dex"
        src={`https://dexscreener.com/${chain}`}
        width="100%"
        height="700"
        className="rounded-lg shadow-lg"
      ></iframe>

      {showSwap && (
        <div
          style={{
            display: "block",
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: 420,
              margin: "60px auto",
              background: "#fff",
              padding: 10,
              borderRadius: 10,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowSwap(false)}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                background: "#ff4d4f",
                color: "white",
                borderRadius: "50%",
                width: 30,
                height: 30,
                fontWeight: "bold",
              }}
            >
              ❌
            </button>

            <iframe
              src="https://jup.ag/swap/SOL-USDC?ref=YOUR_WALLET_ADDRESS"
              width="100%"
              height="500"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default DexScreenerIframe;
