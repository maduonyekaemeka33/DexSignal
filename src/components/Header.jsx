import React from "react";
import WalletButton from "./WalletButton";

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "var(--background-secondary)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(12px)",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "var(--primary-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "800",
    color: "var(--foreground)",
    letterSpacing: "-0.02em",
  },
  logoAccent: {
    color: "var(--primary)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "var(--input-bg)",
    borderRadius: "var(--radius)",
    padding: "4px",
    border: "1px solid var(--border)",
  },
  navItem: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "none",
    color: "var(--foreground-muted)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  navItemActive: {
    background: "var(--background-card)",
    color: "var(--foreground)",
    fontWeight: "600",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};

function GeckoLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        fill="var(--primary)"
        opacity="0.2"
      />
      <path
        d="M12 4c-1.5 0-3 .5-4 1.5C7 6.5 6 8 6 10c0 3 2 5 4 6l2 2 2-2c2-1 4-3 4-6 0-2-1-3.5-2-4.5-1-1-2.5-1.5-4-1.5z"
        fill="var(--primary)"
      />
      <circle cx="9.5" cy="9" r="1.5" fill="var(--background)" />
      <circle cx="14.5" cy="9" r="1.5" fill="var(--background)" />
      <circle cx="9.5" cy="9" r="0.7" fill="var(--foreground)" />
      <circle cx="14.5" cy="9" r="0.7" fill="var(--foreground)" />
    </svg>
  );
}

export default function Header({ currentPage, onPageChange }) {
  const pages = [
    { id: "swap", label: "Swap" },
    { id: "dashboard", label: "Dashboard" },
    { id: "charts", label: "Charts" },
    { id: "approvals", label: "Approvals" },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.logoArea} onClick={() => onPageChange("swap")} role="button" tabIndex={0}>
        <div style={styles.logoIcon}>
          <GeckoLogo />
        </div>
        <span style={styles.logoText}>
          Dex <span style={styles.logoAccent}>Gecko</span>
        </span>
      </div>

      <nav style={styles.nav} aria-label="Main navigation">
        {pages.map((page) => (
          <button
            key={page.id}
            style={{
              ...styles.navItem,
              ...(currentPage === page.id ? styles.navItemActive : {}),
            }}
            onClick={() => onPageChange(page.id)}
            onMouseEnter={(e) => {
              if (currentPage !== page.id) {
                e.target.style.color = "var(--foreground)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page.id) {
                e.target.style.color = "var(--foreground-muted)";
              }
            }}
            aria-current={currentPage === page.id ? "page" : undefined}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <div style={styles.rightSection}>
        <WalletButton />
      </div>
    </header>
  );
}
