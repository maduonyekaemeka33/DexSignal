import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import { ERC20_ABI } from "../constants/tokens";

const styles = {
  overlay: {
    position: "fixed",
    inset: "0",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    maxHeight: "80vh",
    margin: "0 16px",
    display: "flex",
    flexDirection: "column",
    animation: "fadeIn 0.2s ease-out",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 20px 16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--foreground)",
  },
  closeBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--foreground-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.2s",
  },
  searchBox: {
    margin: "0 20px 16px",
    padding: "12px 14px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    fontSize: "14px",
    outline: "none",
    width: "calc(100% - 40px)",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "0 8px 8px",
  },
  tokenItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "background 0.15s",
    width: "100%",
    border: "none",
    background: "none",
    color: "var(--foreground)",
    textAlign: "left",
  },
  tokenIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "var(--primary-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--primary)",
    flexShrink: 0,
  },
  tokenInfo: {
    flex: 1,
    minWidth: 0,
  },
  tokenSymbol: {
    fontSize: "15px",
    fontWeight: "600",
  },
  tokenName: {
    fontSize: "12px",
    color: "var(--foreground-muted)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tokenAddress: {
    fontSize: "11px",
    color: "var(--foreground-muted)",
    fontFamily: "monospace",
  },
  selectedBadge: {
    padding: "2px 8px",
    borderRadius: "6px",
    background: "var(--primary-muted)",
    color: "var(--primary)",
    fontSize: "11px",
    fontWeight: "600",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    margin: "0 20px 12px",
  },
  customSection: {
    padding: "0 20px 16px",
  },
  customLabel: {
    fontSize: "12px",
    color: "var(--foreground-muted)",
    marginBottom: "8px",
    display: "block",
  },
  customInput: {
    width: "100%",
    padding: "10px 12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--foreground)",
    fontSize: "13px",
    fontFamily: "monospace",
    outline: "none",
    transition: "border-color 0.2s",
  },
  customToken: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    background: "var(--input-bg)",
    borderRadius: "8px",
    marginTop: "8px",
  },
};

export default function TokenSelector({ tokens, onSelect, onClose, selectedToken }) {
  const { provider } = useWallet();
  const [search, setSearch] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customToken, setCustomToken] = useState(null);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadCustomToken = async () => {
      if (!ethers.isAddress(customAddress) || !provider) {
        setCustomToken(null);
        return;
      }
      setIsLoadingCustom(true);
      try {
        const contract = new ethers.Contract(customAddress, ERC20_ABI, provider);
        const [symbol, name, decimals] = await Promise.all([
          contract.symbol(),
          contract.name(),
          contract.decimals(),
        ]);
        setCustomToken({
          symbol,
          name,
          address: customAddress,
          decimals: Number(decimals),
        });
      } catch {
        setCustomToken(null);
      } finally {
        setIsLoadingCustom(false);
      }
    };
    loadCustomToken();
  }, [customAddress, provider]);

  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Select a token"
    >
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Select Token</h3>
          <button
            style={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--foreground-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search by name or paste address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (ethers.isAddress(e.target.value)) {
              setCustomAddress(e.target.value);
            }
          }}
          style={styles.searchBox}
          aria-label="Search tokens"
          onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />

        <div style={styles.list}>
          {filteredTokens.map((token) => (
            <button
              key={token.address}
              style={styles.tokenItem}
              onClick={() => onSelect(token)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div style={styles.tokenIcon}>{token.symbol.slice(0, 2)}</div>
              <div style={styles.tokenInfo}>
                <div style={styles.tokenSymbol}>{token.symbol}</div>
                <div style={styles.tokenName}>{token.name}</div>
              </div>
              {selectedToken?.address === token.address && (
                <span style={styles.selectedBadge}>Selected</span>
              )}
            </button>
          ))}

          {filteredTokens.length === 0 && !customToken && (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--foreground-muted)",
                fontSize: "14px",
              }}
            >
              No tokens found. Try pasting a contract address.
            </div>
          )}
        </div>

        <div style={styles.divider} />

        <div style={styles.customSection}>
          <span style={styles.customLabel}>Custom Token Address</span>
          <input
            type="text"
            placeholder="0x..."
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            style={styles.customInput}
            aria-label="Custom token address"
            onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          {isLoadingCustom && (
            <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="spinner" style={{ width: "14px", height: "14px" }} />
              <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>Loading token info...</span>
            </div>
          )}
          {customToken && (
            <button
              style={{ ...styles.customToken, cursor: "pointer", width: "100%", border: "none" }}
              onClick={() => onSelect(customToken)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--input-bg)")}
            >
              <div style={{ ...styles.tokenIcon, width: "28px", height: "28px", fontSize: "11px" }}>
                {customToken.symbol.slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  {customToken.symbol}
                </div>
                <div style={{ fontSize: "11px", color: "var(--foreground-muted)" }}>
                  {customToken.name}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
