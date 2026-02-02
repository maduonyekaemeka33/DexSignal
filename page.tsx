'use client';

import { useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// =====================
// TYPES
// =====================
interface Token {
  symbol: string;
  name: string;
}

interface Pair {
  pairAddress: string;
  baseToken: Token;
  priceUsd?: string; // optional in case API returns undefined
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  chainId?: string;
  pairCreatedAt: number; // assume milliseconds; if API returns seconds, multiply by 1000
}

// =====================
// PAGE
// =====================
export default function HomePage() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [chain, setChain] = useState<'solana' | 'ethereum'>('solana');
  const [sort, setSort] = useState<'volume' | 'liquidity' | 'age'>('volume');

  // ---------------------
  // FETCH DEXSCREENER
  // ---------------------
  useEffect(() => {
    let isMounted = true;

    async function fetchPairs() {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chain}`);
        const data = await res.json();

        if (!data || !Array.isArray(data.pairs)) return;

        if (isMounted) setPairs(data.pairs);
      } catch (err) {
        console.error('Failed to fetch pairs:', err);
      }
    }

    fetchPairs();
    const interval = setInterval(fetchPairs, 30000); // refresh every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chain]);

  // ---------------------
  // SORT + FILTER
  // ---------------------
  const filtered = useMemo(() => {
    const list = [...pairs];

    if (sort === 'volume') list.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
    if (sort === 'liquidity') list.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
    if (sort === 'age') list.sort((a, b) => b.pairCreatedAt - a.pairCreatedAt);

    return list.slice(0, 25);
  }, [pairs, sort]);

  // ---------------------
  // RENDER
  // ---------------------
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <h1 className="text-xl font-bold">Dex Signal</h1>
        <div className="flex items-center gap-3">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">X</a>
          <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Telegram</a>
          <WalletMultiButton className="!bg-green-500 !text-black" />
        </div>
      </header>

      {/* CONTROLS */}
      <section className="px-6 py-6 flex flex-wrap gap-3 items-center">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as 'solana' | 'ethereum')}
          className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2"
        >
          <option value="solana">Solana</option>
          <option value="ethereum">Ethereum</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'volume' | 'liquidity' | 'age')}
          className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2"
        >
          <option value="volume">Sort by Volume</option>
          <option value="liquidity">Sort by Liquidity</option>
          <option value="age">Sort by Newest</option>
        </select>
      </section>

      {/* SCANNER TABLE */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full border border-neutral-800 rounded-xl text-sm">
            <thead className="bg-neutral-900 text-gray-400">
              <tr>
                <th className="p-3 text-left">Token</th>
                <th className="p-3">Price</th>
                <th className="p-3">24h Vol</th>
                <th className="p-3">Liquidity</th>
                <th className="p-3">Age</th>
                <th className="p-3">Risk</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const ageMin = Math.floor((Date.now() - p.pairCreatedAt) / 60000); // milliseconds
                const lowLiq = (p.liquidity?.usd || 0) < 50000;
                return (
                  <tr key={p.pairAddress} className="border-t border-neutral-800 hover:bg-neutral-900">
                    <td className="p-3 font-semibold">
                      {p.baseToken.symbol}
                      {ageMin < 60 && <span className="ml-2 text-green-400">🔥 NEW</span>}
                    </td>
                    <td className="p-3">${Number(p.priceUsd || 0).toFixed(6)}</td>
                    <td className="p-3">${(p.volume?.h24 || 0).toLocaleString()}</td>
                    <td className="p-3">${(p.liquidity?.usd || 0).toLocaleString()}</td>
                    <td className="p-3">{ageMin}m</td>
                    <td className="p-3">
                      {lowLiq ? <span className="text-red-400">Low LP</span> : <span className="text-green-400">OK</span>}
                    </td>
                    <td className="p-3">
                      <a
                        href={
                          chain === 'solana'
                            ? `https://jup.ag/swap/${p.baseToken.symbol}-SOL`
                            : `https://app.uniswap.org/#/swap?inputCurrency=${p.baseToken.symbol}&outputCurrency=ETH`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-black px-3 py-1 rounded-md"
                      >
                        Swap
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-10 border-t border-neutral-800">
        © {new Date().getFullYear()} Dex Signal · Not financial advice
      </footer>
    </main>
  );
                    }
