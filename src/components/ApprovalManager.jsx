import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import {
  COMMON_TOKENS,
  ROUTER_ADDRESSES,
  ERC20_ABI,
} from "../constants/tokens";

const styles = {
  container: {
    maxWidth: "680px",
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
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--foreground)",
  },
  refreshBtn: {
    padding: "6px 12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--foreground-muted)",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "border-color 0.2s",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.15s",
  },
  tokenInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  tokenIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "var(--primary-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    color: "var(--primary)",
    flexShrink: 0,
  },
  tokenSymbol: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--foreground)",
  },
  tokenName: {
    fontSize: "12px",
    color: "var(--foreground-muted)",
  },
  allowanceInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  allowanceBadge: {
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  unlimitedBadge: {
    background: "rgba(245, 158, 11, 0.1)",
    color: "var(--warning)",
  },
  limitedBadge: {
    background: "var(--primary-muted)",
    color: "var(--primary)",
  },
  zeroBadge: {
    background: "var(--input-bg)",
    color: "var(--foreground-muted)",
  },
  revokeBtn: {
    padding: "6px 14px",
    background: "none",
    border: "1px solid var(--destructive)",
    borderRadius: "8px",
    color: "var(--destructive)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  emptyState: {
    padding: "48px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "var(--primary-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--foreground)",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "var(--foreground-muted)",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px",
    justifyContent: "center",
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
    marginBottom: "12px",
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

export default function ApprovalManager() {
  const { signer, account, chainId, provider } = useWallet();
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [revokingToken, setRevokingToken] = useState(null);

  const tokens = COMMON_TOKENS[chainId] || COMMON_TOKENS[1];
  const routerAddress = ROUTER_ADDRESSES[chainId] || ROUTER_ADDRESSES[1];

  const checkApprovals = useCallback(async () => {
    if (!provider || !account) return;
    setIsLoading(true);

    try {
      const results = [];

      for (const token of tokens) {
        if (token.isNative) continue;

        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const allowance = await contract.allowance(account, routerAddress);

          results.push({
            ...token,
            allowance,
            isUnlimited: allowance >= ethers.MaxUint256 / 2n,
            formattedAllowance:
              allowance >= ethers.MaxUint256 / 2n
                ? "Unlimited"
                : parseFloat(ethers.formatUnits(allowance, token.decimals)).toFixed(4),
          });
        } catch {
          results.push({
            ...token,
            allowance: 0n,
            isUnlimited: false,
            formattedAllowance: "0",
          });
        }
      }

      setApprovals(results);
    } catch (err) {
      console.error("Error checking approvals:", err);
    } finally {
      setIsLoading(false);
    }
  }, [provider, account, tokens, routerAddress]);

  useEffect(() => {
    checkApprovals();
  }, [checkApprovals]);

  async function revokeApproval(token) {
    if (!signer) return;
    setRevokingToken(token.address);

    try {
      const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
      const tx = await contract.approve(routerAddress, 0n);
      await tx.wait();
      await checkApprovals();
    } catch (err) {
      console.error("Revoke error:", err);
    } finally {
      setRevokingToken(null);
    }
  }

  const activeApprovals = approvals.filter((a) => a.allowance > 0n);

  if (!account) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <p style={styles.emptyTitle}>Connect Your Wallet</p>
            <p style={styles.emptyText}>Connect your wallet to view and manage token approvals</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Token Approvals</h1>
        <p style={styles.subtitle}>
          View and revoke token approvals granted to the Dex Gecko router.
          Revoking sets the allowance to zero, preventing future transfers.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>
            {activeApprovals.length > 0
              ? `${activeApprovals.length} Active Approval${activeApprovals.length > 1 ? "s" : ""}`
              : "Approvals"}
          </span>
          <button
            style={styles.refreshBtn}
            onClick={checkApprovals}
            disabled={isLoading}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--foreground-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            {isLoading ? (
              <span className="spinner" style={{ width: "14px", height: "14px" }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            )}
            Refresh
          </button>
        </div>

        {isLoading && approvals.length === 0 ? (
          <div style={styles.loadingRow}>
            <span className="spinner" />
            <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>
              Checking approvals...
            </span>
          </div>
        ) : approvals.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No Token Data</p>
            <p style={styles.emptyText}>No tokens found for this network</p>
          </div>
        ) : (
          approvals
            .filter((a) => !a.isNative)
            .map((approval) => (
              <div
                key={approval.address}
                style={styles.row}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--input-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <div style={styles.tokenInfo}>
                  <div style={styles.tokenIcon}>{approval.symbol.slice(0, 2)}</div>
                  <div>
                    <div style={styles.tokenSymbol}>{approval.symbol}</div>
                    <div style={styles.tokenName}>{approval.name}</div>
                  </div>
                </div>

                <div style={styles.allowanceInfo}>
                  <span
                    style={{
                      ...styles.allowanceBadge,
                      ...(approval.allowance === 0n
                        ? styles.zeroBadge
                        : approval.isUnlimited
                        ? styles.unlimitedBadge
                        : styles.limitedBadge),
                    }}
                  >
                    {approval.allowance === 0n
                      ? "No Approval"
                      : approval.formattedAllowance}
                  </span>
                  {approval.allowance > 0n && (
                    <button
                      style={styles.revokeBtn}
                      onClick={() => revokeApproval(approval)}
                      disabled={revokingToken === approval.address}
                      onMouseEnter={(e) => {
                        e.target.style.background = "var(--destructive)";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "none";
                        e.target.style.color = "var(--destructive)";
                      }}
                    >
                      {revokingToken === approval.address ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span className="spinner" style={{ width: "12px", height: "12px" }} />
                          Revoking...
                        </span>
                      ) : (
                        "Revoke"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--primary)">
            <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm-.75 4.75v4.5a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0zM8 12a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          About Token Approvals
        </h3>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>
            <strong>Unlimited approvals</strong> allow the router to transfer any amount of the token without
            re-approving. This is gas-efficient but carries risk.
          </span>
        </div>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>
            <strong>Revoking</strong> sets the allowance to zero, preventing any future transfers by the
            router until you re-approve.
          </span>
        </div>
        <div style={styles.infoItem}>
          <div style={styles.infoDot} />
          <span>
            Revoking an approval requires a transaction and will cost a small amount of gas.
          </span>
        </div>
      </div>
    </div>
  );
}
