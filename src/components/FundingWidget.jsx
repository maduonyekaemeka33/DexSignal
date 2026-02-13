import React, { useState } from "react";

// ----- Funding wallet addresses -----
const BTC_WALLET = "19WpCZVWVEYQuLBy9pEiLT4r8hhWMNSeGf";
const USDT_WALLET = "0x695d7ba9ee661088ec65b4967870fc972c29636a";

const styles = {
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "20px 16px",
    animation: "fadeIn 0.3s ease-out",
  },
  headerSection: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--foreground)",
    marginBottom: "8px",
  },
  titleAccent: {
    color: "var(--primary)",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--foreground-muted)",
    lineHeight: "1.5",
  },
  card: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "16px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px",
    borderBottom: "1px solid var(--border)",
  },
  networkIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--foreground)",
  },
  cardNetwork: {
    fontSize: "13px",
    color: "var(--foreground-muted)",
    marginTop: "2px",
  },
  cardBody: {
    padding: "20px",
  },
  addressGroup: {
    marginBottom: "16px",
  },
  addressLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--foreground-muted)",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  addressRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px 14px",
  },
  addressText: {
    flex: 1,
    fontSize: "13px",
    fontFamily: "monospace",
    color: "var(--foreground)",
    wordBreak: "break-all",
    lineHeight: "1.4",
  },
  copyBtn: {
    padding: "6px 12px",
    background: "var(--primary-muted)",
    border: "1px solid transparent",
    borderRadius: "8px",
    color: "var(--primary)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  warningBanner: {
    padding: "12px 14px",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.15)",
    borderRadius: "var(--radius)",
    fontSize: "13px",
    color: "var(--destructive)",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  warningIcon: {
    flexShrink: 0,
    marginTop: "2px",
  },
  infoCard: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "16px",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--foreground)",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "13px",
    color: "var(--foreground-muted)",
    lineHeight: "1.5",
  },
  infoDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--primary)",
    marginTop: "6px",
    flexShrink: 0,
  },
};

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 4V1.5C4 1.22 4.22 1 4.5 1H14.5C14.78 1 15 1.22 15 1.5V11.5C15 11.78 14.78 12 14.5 12H12V14.5C12 14.78 11.78 15 11.5 15H1.5C1.22 15 1 14.78 1 14.5V4.5C1 4.22 1.22 4 1.5 4H4ZM5 4H11.5C11.78 4 12 4.22 12 4.5V11H14V2H5V4ZM2 5V14H11V5H2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
    </svg>
  );
}

function WarningTriangle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={styles.warningIcon}>
      <path d="M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 01-1.1 0L7.1 5.995A.905.905 0 018 5zm.002 6a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  );
}

export default function FundingWidget() {
  const [copiedBtc, setCopiedBtc] = useState(false);
  const [copiedUsdt, setCopiedUsdt] = useState(false);

  const handleCopy = async (address, setCopied) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>
          Fund Your <span style={styles.titleAccent}>Wallet</span>
        </h1>
        <p style={styles.subtitle}>
          Deposit funds to start trading on Dex Gecko. Send crypto to the
          addresses below using the correct network.
        </p>
      </div>

      {/* ----- BTC Funding Card ----- */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.networkIcon, background: "rgba(247, 147, 26, 0.12)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#F7931A">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-3.903c.27-1.81-.877-2.782-2.37-3.43l.485-1.942-1.184-.295-.472 1.89c-.311-.077-.632-.15-.95-.222l.475-1.905-1.183-.295-.484 1.94c-.258-.058-.511-.116-.757-.177l.001-.005-1.633-.408-.314 1.263s.877.201.859.213c.479.12.565.436.55.687l-.55 2.21c.033.008.076.02.123.038l-.125-.031-.772 3.094c-.058.145-.207.362-.542.28.012.017-.86-.215-.86-.215l-.587 1.354 1.54.384c.287.072.568.147.845.218l-.49 1.964 1.183.295.485-1.944c.323.088.637.169.943.245l-.483 1.936 1.184.295.489-1.96c2.014.381 3.53.228 4.168-1.594.515-1.469-.025-2.316-1.088-2.868.774-.178 1.356-.687 1.51-1.738z" />
            </svg>
          </div>
          <div style={styles.cardTitleGroup}>
            <div style={styles.cardTitle}>Bitcoin (BTC)</div>
            <div style={styles.cardNetwork}>Network: BTC Mainnet</div>
          </div>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.addressGroup}>
            <span style={styles.addressLabel}>Deposit Address</span>
            <div style={styles.addressRow}>
              <span style={styles.addressText}>{BTC_WALLET}</span>
              <button
                style={styles.copyBtn}
                onClick={() => handleCopy(BTC_WALLET, setCopiedBtc)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "var(--background)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--primary-muted)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
              >
                {copiedBtc ? <CheckIcon /> : <CopyIcon />}
                {copiedBtc ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div style={styles.warningBanner}>
            <WarningTriangle />
            <span>
              Only send <strong>BTC</strong> to this address on the{" "}
              <strong>Bitcoin mainnet</strong>. Sending any other asset or using
              a different network will result in permanent loss of funds.
            </span>
          </div>
        </div>
      </div>

      {/* ----- USDT Funding Card ----- */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.networkIcon, background: "rgba(38, 161, 123, 0.12)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#26A17B">
              <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0zm5.894 8.221h-2.965V6.775h-9.86v1.446H2.106v2.18h2.963v1.34c0 3.022 2.332 3.48 4.963 3.6v3.882h1.934v-3.882c2.632-.12 4.964-.578 4.964-3.6v-1.34h2.964v-2.18zm-4.93 3.52c0 1.678-1.462 1.932-2.964 2.016v-4.032c1.502.084 2.964.338 2.964 2.016zm-4.929 0c0 1.678-1.461 1.932-2.963 2.016v-4.032c1.502.084 2.963.338 2.963 2.016z" />
            </svg>
          </div>
          <div style={styles.cardTitleGroup}>
            <div style={styles.cardTitle}>Tether (USDT)</div>
            <div style={styles.cardNetwork}>Network: Ethereum (ERC-20)</div>
          </div>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.addressGroup}>
            <span style={styles.addressLabel}>Deposit Address</span>
            <div style={styles.addressRow}>
              <span style={styles.addressText}>{USDT_WALLET}</span>
              <button
                style={styles.copyBtn}
                onClick={() => handleCopy(USDT_WALLET, setCopiedUsdt)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "var(--background)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--primary-muted)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
              >
                {copiedUsdt ? <CheckIcon /> : <CopyIcon />}
                {copiedUsdt ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div style={styles.warningBanner}>
            <WarningTriangle />
            <span>
              Only send <strong>USDT (ERC-20)</strong> to this address on the{" "}
              <strong>Ethereum network</strong>. Sending tokens on BSC, Tron, or
              any other network will result in permanent loss of funds.
            </span>
          </div>
        </div>
      </div>

      {/* ----- Info Section ----- */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--primary)">
            <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm-.75 4.75v4.5a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0zM8 12a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          Important Information
        </h3>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>Always double-check the network before sending. Funds sent on the wrong network cannot be recovered.</span>
        </div>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>BTC deposits typically require 3 network confirmations before they are credited.</span>
        </div>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>USDT (ERC-20) deposits typically require 12 network confirmations on Ethereum.</span>
        </div>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>Contact support if your deposit does not appear after a reasonable waiting period.</span>
        </div>
      </div>
    </div>
  );
}
