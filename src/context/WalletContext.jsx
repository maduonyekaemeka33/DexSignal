import React, { createContext, useContext, useState, useCallback } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

const SUPPORTED_CHAINS = {
  1: { name: "Ethereum", symbol: "ETH", explorer: "https://etherscan.io" },
  56: { name: "BNB Chain", symbol: "BNB", explorer: "https://bscscan.com" },
  137: { name: "Polygon", symbol: "MATIC", explorer: "https://polygonscan.com" },
  42161: { name: "Arbitrum", symbol: "ETH", explorer: "https://arbiscan.io" },
  10: { name: "Optimism", symbol: "ETH", explorer: "https://optimistic.etherscan.io" },
  8453: { name: "Base", symbol: "ETH", explorer: "https://basescan.org" },
};

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [walletType, setWalletType] = useState("");

  const getChainInfo = useCallback(
    (id) => SUPPORTED_CHAINS[id] || { name: `Chain ${id}`, symbol: "ETH", explorer: "" },
    []
  );

  const updateBalance = useCallback(async (prov, addr) => {
    try {
      const bal = await prov.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    } catch {
      setBalance("0");
    }
  }, []);

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it from metamask.io");
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const s = await prov.getSigner();
      const addr = await s.getAddress();
      const network = await prov.getNetwork();
      const chain = Number(network.chainId);

      setProvider(prov);
      setSigner(s);
      setAccount(addr);
      setChainId(chain);
      setWalletType("MetaMask");
      await updateBalance(prov, addr);

      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          const newSigner = await prov.getSigner();
          setAccount(accounts[0]);
          setSigner(newSigner);
          await updateBalance(prov, accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (err) {
      setError(err.message || "Failed to connect MetaMask");
    } finally {
      setIsConnecting(false);
    }
  }, [updateBalance]);

  const connectWalletConnect = useCallback(async () => {
    setIsConnecting(true);
    setError("");

    try {
      const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
      const wcProvider = await EthereumProvider.init({
        projectId: "e899c82be21d4acca2c8aec45e893598",
        chains: [1],
        optionalChains: [56, 137, 42161, 10, 8453],
        showQrModal: true,
      });

      await wcProvider.enable();

      const prov = new ethers.BrowserProvider(wcProvider);
      const s = await prov.getSigner();
      const addr = await s.getAddress();
      const network = await prov.getNetwork();
      const chain = Number(network.chainId);

      setProvider(prov);
      setSigner(s);
      setAccount(addr);
      setChainId(chain);
      setWalletType("WalletConnect");
      await updateBalance(prov, addr);

      wcProvider.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          const newSigner = await prov.getSigner();
          setAccount(accounts[0]);
          setSigner(newSigner);
          await updateBalance(prov, accounts[0]);
        }
      });

      wcProvider.on("chainChanged", () => {
        window.location.reload();
      });

      wcProvider.on("disconnect", () => {
        disconnect();
      });
    } catch (err) {
      if (err.message?.includes("User rejected")) {
        setError("Connection rejected by user");
      } else {
        setError(err.message || "Failed to connect via WalletConnect");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount("");
    setChainId(null);
    setBalance("0");
    setWalletType("");
    setError("");
  }, []);

  const shortenAddress = useCallback((addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        balance,
        isConnecting,
        error,
        walletType,
        connectMetaMask,
        connectWalletConnect,
        disconnect,
        shortenAddress,
        getChainInfo,
        SUPPORTED_CHAINS,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
