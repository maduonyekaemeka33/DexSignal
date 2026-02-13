import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

const styles = {
  wrapper: {
    position: "relative",
  },
  connectBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "var(--primary)",
    color: "var(--background)",
    border: "none",
    borderRadius: "var(--radius)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  connectedBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 16px",
    background: "var(--background-card)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    fontSize: "14px",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    background: "var(--primary-muted)",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--primary)",
  },
  balanceText: {
    fontSize: "13px",
    color: "var(--foreground-muted)",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: "0",
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px",
    minWidth: "220px",
    zIndex: 100,
    animation: "fadeIn 0.2s ease-out",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    background: "none",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    color: "var(--foreground)",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.15s",
    textAlign: "left",
  },
  disconnectItem: {
    color: "var(--destructive)",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    margin: "4px 0",
  },
  modal: {
    position: "fixed",
    inset: "0",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modalContent: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "400px",
    margin: "0 16px",
    animation: "fadeIn 0.2s ease-out",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "var(--foreground)",
  },
  modalSubtitle: {
    fontSize: "14px",
    color: "var(--foreground-muted)",
    marginBottom: "24px",
  },
  walletOption: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    width: "100%",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    marginBottom: "12px",
    color: "var(--foreground)",
    fontSize: "15px",
    fontWeight: "500",
  },
  walletIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  cancelBtn: {
    width: "100%",
    padding: "12px",
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground-muted)",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "4px",
    transition: "border-color 0.2s",
  },
  errorText: {
    color: "var(--destructive)",
    fontSize: "13px",
    marginTop: "12px",
    padding: "10px",
    background: "rgba(239, 68, 68, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
};

function MetaMaskIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21.3 2L13.1 8.2L14.6 4.5L21.3 2Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.2" />
      <path d="M2.7 2L10.8 8.3L9.4 4.5L2.7 2Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
      <path d="M18.5 16.8L16.3 20.3L20.8 21.5L22 16.9L18.5 16.8Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
      <path d="M2 16.9L3.2 21.5L7.7 20.3L5.5 16.8L2 16.9Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
      <path d="M7.5 10.5L6.3 12.3L10.8 12.5L10.6 7.7L7.5 10.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
      <path d="M16.5 10.5L13.3 7.6L13.1 12.5L17.7 12.3L16.5 10.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
      <path d="M7.7 20.3L10.5 18.9L8.1 16.9L7.7 20.3Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
      <path d="M13.5 18.9L16.3 20.3L15.9 16.9L13.5 18.9Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.2" />
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.1 8.5C9.4 5.3 14.6 5.3 17.9 8.5L18.3 8.9C18.5 9.1 18.5 9.3 18.3 9.5L17 10.8C16.9 10.9 16.8 10.9 16.7 10.8L16.1 10.2C13.8 8 10.2 8 7.9 10.2L7.3 10.8C7.2 10.9 7 10.9 6.9 10.8L5.7 9.5C5.5 9.3 5.5 9.1 5.7 8.9L6.1 8.5Z"
        fill="#3396FF"
      />
      <path
        d="M20.2 10.8L21.4 12C21.6 12.2 21.6 12.4 21.4 12.6L16.3 17.6C16.1 17.8 15.8 17.8 15.6 17.6L12.2 14.3C12.1 14.2 12 14.2 11.9 14.3L8.5 17.6C8.3 17.8 8 17.8 7.8 17.6L2.6 12.6C2.4 12.4 2.4 12.2 2.6 12L3.8 10.8C4 10.6 4.3 10.6 4.5 10.8L7.9 14.1C8 14.2 8.1 14.2 8.2 14.1L11.6 10.8C11.8 10.6 12.1 10.6 12.3 10.8L15.7 14.1C15.8 14.2 15.9 14.2 16 14.1L19.4 10.8C19.7 10.6 20 10.6 20.2 10.8Z"
        fill="#3396FF"
      />
    </svg>
  );
}

export default function WalletButton() {
  const {
    account,
    balance,
    chainId,
    isConnecting,
    error,
    walletType,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    shortenAddress,
    getChainInfo,
  } = useWallet();

  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async (type) => {
    if (type === "metamask") {
      await connectMetaMask();
    } else {
      await connectWalletConnect();
    }
    setShowModal(false);
  };

  if (account) {
    const chain = getChainInfo(chainId);
    return (
      <div style={styles.wrapper}>
        <button
          style={styles.connectedBtn}
          onClick={() => setShowDropdown(!showDropdown)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          aria-label="Wallet menu"
          aria-expanded={showDropdown}
        >
          <span style={styles.badge}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--primary)",
              }}
            />
            {chain.name}
          </span>
          <span style={styles.balanceText}>
            {parseFloat(balance).toFixed(4)} {chain.symbol}
          </span>
          <span style={{ fontWeight: "600" }}>{shortenAddress(account)}</span>
        </button>

        {showDropdown && (
          <div style={styles.dropdown} role="menu">
            <button
              style={styles.dropdownItem}
              onClick={() => {
                navigator.clipboard.writeText(account);
                setShowDropdown(false);
              }}
              role="menuitem"
              onMouseEnter={(e) => (e.target.style.background = "var(--primary-muted)")}
              onMouseLeave={(e) => (e.target.style.background = "none")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 4V1.5C4 1.22 4.22 1 4.5 1H14.5C14.78 1 15 1.22 15 1.5V11.5C15 11.78 14.78 12 14.5 12H12V14.5C12 14.78 11.78 15 11.5 15H1.5C1.22 15 1 14.78 1 14.5V4.5C1 4.22 1.22 4 1.5 4H4ZM5 4H11.5C11.78 4 12 4.22 12 4.5V11H14V2H5V4ZM2 5V14H11V5H2Z" />
              </svg>
              Copy Address
            </button>
            {chain.explorer && (
              <a
                href={`${chain.explorer}/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.dropdownItem,
                  textDecoration: "none",
                  color: "var(--foreground)",
                }}
                role="menuitem"
                onMouseEnter={(e) => (e.target.style.background = "var(--primary-muted)")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                  <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                </svg>
                View on Explorer
              </a>
            )}
            <div style={styles.divider} />
            <button
              style={{ ...styles.dropdownItem, ...styles.disconnectItem }}
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              role="menuitem"
              onMouseEnter={(e) => (e.target.style.background = "rgba(239, 68, 68, 0.1)")}
              onMouseLeave={(e) => (e.target.style.background = "none")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                <path d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
              </svg>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        style={{
          ...styles.connectBtn,
          opacity: isConnecting ? 0.7 : 1,
          pointerEvents: isConnecting ? "none" : "auto",
        }}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => (e.target.style.background = "var(--primary-hover)")}
        onMouseLeave={(e) => (e.target.style.background = "var(--primary)")}
      >
        {isConnecting ? (
          <>
            <span className="spinner" />
            Connecting...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>

      {showModal && (
        <div
          style={styles.modal}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Connect wallet"
        >
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Connect Wallet</h2>
            <p style={styles.modalSubtitle}>Choose your preferred wallet to get started</p>

            <button
              style={styles.walletOption}
              onClick={() => handleConnect("metamask")}
              disabled={isConnecting}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              <div style={{ ...styles.walletIcon, background: "#F6851B20" }}>
                <MetaMaskIcon />
              </div>
              <div>
                <div style={{ fontWeight: "600" }}>MetaMask</div>
                <div style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>
                  Browser extension wallet
                </div>
              </div>
            </button>

            <button
              style={styles.walletOption}
              onClick={() => handleConnect("walletconnect")}
              disabled={isConnecting}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              <div style={{ ...styles.walletIcon, background: "#3396FF20" }}>
                <WalletConnectIcon />
              </div>
              <div>
                <div style={{ fontWeight: "600" }}>WalletConnect</div>
                <div style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>
                  Scan with mobile wallet
                </div>
              </div>
            </button>

            <button
              style={styles.cancelBtn}
              onClick={() => setShowModal(false)}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--foreground-muted)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              Cancel
            </button>

            {error && <p style={styles.errorText}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
