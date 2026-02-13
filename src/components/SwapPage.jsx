import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import {
  COMMON_TOKENS,
  ROUTER_ADDRESSES,
  ERC20_ABI,
  ROUTER_ABI,
} from "../constants/tokens";
import TokenSelector from "./TokenSelector";

const styles = {
  container: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "20px 16px",
    animation: "fadeIn 0.3s ease-out",
  },
  card: {
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--foreground)",
  },
  settingsBtn: {
    padding: "8px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--foreground-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.2s",
  },
  tokenInput: {
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "16px",
    marginBottom: "4px",
    transition: "border-color 0.2s",
  },
  tokenInputFocused: {
    borderColor: "var(--border-focus)",
  },
  label: {
    fontSize: "13px",
    color: "var(--foreground-muted)",
    marginBottom: "8px",
    display: "block",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  amountInput: {
    flex: "1",
    background: "none",
    border: "none",
    fontSize: "24px",
    fontWeight: "600",
    color: "var(--foreground)",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
  },
  tokenBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    color: "var(--foreground)",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    transition: "border-color 0.2s",
  },
  balanceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
    fontSize: "13px",
    color: "var(--foreground-muted)",
  },
  maxBtn: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: "4px",
    transition: "background 0.15s",
  },
  swapArrow: {
    display: "flex",
    justifyContent: "center",
    margin: "-6px 0",
    position: "relative",
    zIndex: 2,
  },
  swapArrowBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "var(--background-card)",
    border: "2px solid var(--border)",
    color: "var(--foreground-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  approvalSection: {
    marginTop: "16px",
    padding: "14px",
    background: "var(--input-bg)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
  },
  approvalLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--foreground)",
    marginBottom: "10px",
    display: "block",
  },
  radioGroup: {
    display: "flex",
    gap: "8px",
  },
  radioOption: {
    flex: "1",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "none",
    color: "var(--foreground)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s",
  },
  radioOptionActive: {
    borderColor: "var(--primary)",
    background: "var(--primary-muted)",
    color: "var(--primary)",
  },
  warningBanner: {
    marginTop: "10px",
    padding: "10px 12px",
    background: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--warning)",
    lineHeight: "1.4",
  },
  swapBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "var(--radius)",
    border: "none",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "16px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  swapBtnPrimary: {
    background: "var(--primary)",
    color: "var(--background)",
  },
  swapBtnDisabled: {
    background: "var(--border)",
    color: "var(--foreground-muted)",
    cursor: "not-allowed",
  },
  statusBar: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "var(--radius)",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  slippageRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "12px",
    padding: "10px 14px",
    background: "var(--input-bg)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "var(--foreground-muted)",
  },
  slippageInput: {
    width: "50px",
    background: "var(--background-card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "4px 8px",
    color: "var(--foreground)",
    fontSize: "13px",
    textAlign: "center",
    outline: "none",
    fontFamily: "inherit",
  },
};

export default function SwapPage() {
  const { signer, account, chainId, provider } = useWallet();

  const [tokenIn, setTokenIn] = useState(null);
  const [tokenOut, setTokenOut] = useState(null);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [balanceIn, setBalanceIn] = useState("0");
  const [balanceOut, setBalanceOut] = useState("0");
  const [approvalType, setApprovalType] = useState("unlimited");
  const [slippage, setSlippage] = useState("0.5");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState(0n);

  const tokens = COMMON_TOKENS[chainId] || COMMON_TOKENS[1];
  const routerAddress = ROUTER_ADDRESSES[chainId] || ROUTER_ADDRESSES[1];

  useEffect(() => {
    if (tokens.length >= 2) {
      setTokenIn(tokens[0]);
      setTokenOut(tokens[1]);
    }
  }, [chainId]);

  const fetchBalance = useCallback(
    async (token, setter) => {
      if (!provider || !account || !token) return;
      try {
        if (token.isNative) {
          const bal = await provider.getBalance(account);
          setter(ethers.formatEther(bal));
        } else {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const bal = await contract.balanceOf(account);
          setter(ethers.formatUnits(bal, token.decimals));
        }
      } catch {
        setter("0");
      }
    },
    [provider, account]
  );

  useEffect(() => {
    fetchBalance(tokenIn, setBalanceIn);
    fetchBalance(tokenOut, setBalanceOut);
  }, [tokenIn, tokenOut, fetchBalance]);

  useEffect(() => {
    const checkAllowance = async () => {
      if (!provider || !account || !tokenIn || tokenIn.isNative) {
        setCurrentAllowance(0n);
        return;
      }
      try {
        const contract = new ethers.Contract(tokenIn.address, ERC20_ABI, provider);
        const allowance = await contract.allowance(account, routerAddress);
        setCurrentAllowance(allowance);
      } catch {
        setCurrentAllowance(0n);
      }
    };
    checkAllowance();
  }, [provider, account, tokenIn, routerAddress]);

  const needsApproval = useCallback(() => {
    if (!tokenIn || tokenIn.isNative || !amountIn) return false;
    try {
      const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);
      return currentAllowance < amountInWei;
    } catch {
      return false;
    }
  }, [tokenIn, amountIn, currentAllowance]);

  async function approveToken() {
    if (!signer || !tokenIn) return;
    try {
      const token = new ethers.Contract(tokenIn.address, ERC20_ABI, signer);
      let approveAmount;
      if (approvalType === "unlimited") {
        approveAmount = ethers.MaxUint256;
      } else {
        approveAmount = ethers.parseUnits(amountIn, tokenIn.decimals);
      }

      setStatus("Waiting for approval signature...");
      setStatusType("info");
      const tx = await token.approve(routerAddress, approveAmount);
      setStatus("Approval transaction pending...");
      await tx.wait();

      const newAllowance = await token.allowance(account, routerAddress);
      setCurrentAllowance(newAllowance);

      setStatus("Approval successful!");
      setStatusType("success");
    } catch (err) {
      console.error("Approval error:", err);
      if (err.code === "ACTION_REJECTED") {
        setStatus("Approval rejected by user");
      } else {
        setStatus("Approval failed: " + (err.reason || err.message));
      }
      setStatusType("error");
      throw err;
    }
  }

  async function ensureApproval() {
    if (!tokenIn || tokenIn.isNative) return;
    const token = new ethers.Contract(tokenIn.address, ERC20_ABI, signer);
    const allowance = await token.allowance(account, routerAddress);

    if (approvalType === "unlimited") {
      if (allowance === 0n) {
        await approveToken();
      }
    } else {
      const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);
      if (allowance < amountInWei) {
        await approveToken();
      }
    }
  }

  async function handleSwap() {
    if (!signer || !tokenIn || !tokenOut || !amountIn) return;

    setIsLoading(true);
    try {
      setStatus("Checking allowance...");
      setStatusType("info");
      await ensureApproval();

      setStatus("Preparing swap...");
      setStatusType("info");

      const router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);
      const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const slippagePercent = parseFloat(slippage) || 0.5;
      const minAmountOut = 0;

      let tx;

      if (tokenIn.isNative) {
        const wethAddress =
          tokens.find((t) => t.symbol === "WETH" || t.symbol === "WBNB")?.address ||
          tokens[0]?.address;
        tx = await router.swapExactETHForTokens(
          minAmountOut,
          [wethAddress, tokenOut.address],
          account,
          deadline,
          { value: amountInWei }
        );
      } else if (tokenOut.isNative) {
        const wethAddress =
          tokens.find((t) => t.symbol === "WETH" || t.symbol === "WBNB")?.address ||
          tokens[0]?.address;
        tx = await router.swapExactTokensForETH(
          amountInWei,
          minAmountOut,
          [tokenIn.address, wethAddress],
          account,
          deadline
        );
      } else {
        tx = await router.swapExactTokensForTokens(
          amountInWei,
          minAmountOut,
          [tokenIn.address, tokenOut.address],
          account,
          deadline
        );
      }

      setStatus("Swap transaction pending...");
      await tx.wait();
      setStatus("Swap successful!");
      setStatusType("success");

      fetchBalance(tokenIn, setBalanceIn);
      fetchBalance(tokenOut, setBalanceOut);
      setAmountIn("");
      setAmountOut("");
    } catch (err) {
      console.error("Swap error:", err);
      if (err.code === "ACTION_REJECTED") {
        setStatus("Transaction rejected by user");
      } else {
        setStatus("Swap failed: " + (err.reason || err.message));
      }
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSwapTokens() {
    const tempToken = tokenIn;
    const tempAmount = amountIn;
    const tempBalance = balanceIn;
    setTokenIn(tokenOut);
    setTokenOut(tempToken);
    setAmountIn(amountOut);
    setAmountOut(tempAmount);
    setBalanceIn(balanceOut);
    setBalanceOut(tempBalance);
  }

  function handleTokenSelect(token) {
    if (showTokenSelector === "in") {
      if (tokenOut && token.address === tokenOut.address) {
        handleSwapTokens();
      } else {
        setTokenIn(token);
      }
    } else {
      if (tokenIn && token.address === tokenIn.address) {
        handleSwapTokens();
      } else {
        setTokenOut(token);
      }
    }
    setShowTokenSelector(null);
  }

  const getSwapButtonText = () => {
    if (!account) return "Connect Wallet";
    if (!tokenIn || !tokenOut) return "Select Tokens";
    if (!amountIn || parseFloat(amountIn) === 0) return "Enter Amount";
    if (parseFloat(amountIn) > parseFloat(balanceIn)) return "Insufficient Balance";
    if (isLoading) return "";
    if (needsApproval()) return `Approve & Swap`;
    return "Swap";
  };

  const isSwapDisabled =
    !account ||
    !tokenIn ||
    !tokenOut ||
    !amountIn ||
    parseFloat(amountIn) === 0 ||
    parseFloat(amountIn) > parseFloat(balanceIn) ||
    isLoading;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Swap</h2>
          <button
            style={styles.settingsBtn}
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Swap settings"
            onMouseEnter={(e) => (e.target.style.borderColor = "var(--foreground-muted)")}
            onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {showSettings && (
          <div style={{ ...styles.slippageRow, marginTop: 0, marginBottom: "16px" }}>
            <span>Slippage Tolerance</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {["0.1", "0.5", "1.0"].map((val) => (
                <button
                  key={val}
                  onClick={() => setSlippage(val)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid",
                    borderColor: slippage === val ? "var(--primary)" : "var(--border)",
                    background: slippage === val ? "var(--primary-muted)" : "none",
                    color: slippage === val ? "var(--primary)" : "var(--foreground-muted)",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {val}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                style={styles.slippageInput}
                aria-label="Custom slippage"
              />
              <span style={{ fontSize: "12px" }}>%</span>
            </div>
          </div>
        )}

        {/* Token In */}
        <div style={styles.tokenInput}>
          <span style={styles.label}>You Pay</span>
          <div style={styles.inputRow}>
            <input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              style={styles.amountInput}
              aria-label="Amount to pay"
            />
            <button
              style={styles.tokenBtn}
              onClick={() => setShowTokenSelector("in")}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              {tokenIn ? tokenIn.symbol : "Select"}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          </div>
          <div style={styles.balanceRow}>
            <span>Balance: {parseFloat(balanceIn).toFixed(6)}</span>
            {tokenIn && (
              <button
                style={styles.maxBtn}
                onClick={() => setAmountIn(balanceIn)}
                onMouseEnter={(e) => (e.target.style.background = "var(--primary-muted)")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
              >
                MAX
              </button>
            )}
          </div>
        </div>

        {/* Swap Arrow */}
        <div style={styles.swapArrow}>
          <button
            style={styles.swapArrowBtn}
            onClick={handleSwapTokens}
            aria-label="Swap token positions"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--primary-muted)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--background-card)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--foreground-muted)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v10M5 10l3 3 3-3" />
            </svg>
          </button>
        </div>

        {/* Token Out */}
        <div style={styles.tokenInput}>
          <span style={styles.label}>You Receive</span>
          <div style={styles.inputRow}>
            <input
              type="number"
              placeholder="0.0"
              value={amountOut}
              onChange={(e) => setAmountOut(e.target.value)}
              style={{ ...styles.amountInput, color: "var(--foreground-muted)" }}
              readOnly
              aria-label="Amount to receive"
            />
            <button
              style={styles.tokenBtn}
              onClick={() => setShowTokenSelector("out")}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              {tokenOut ? tokenOut.symbol : "Select"}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          </div>
          <div style={styles.balanceRow}>
            <span>Balance: {parseFloat(balanceOut).toFixed(6)}</span>
          </div>
        </div>

        {/* Approval Type */}
        {tokenIn && !tokenIn.isNative && amountIn && (
          <div style={styles.approvalSection} className="animate-fade-in">
            <span style={styles.approvalLabel}>Approval Type</span>
            <div style={styles.radioGroup}>
              <button
                style={{
                  ...styles.radioOption,
                  ...(approvalType === "unlimited" ? styles.radioOptionActive : {}),
                }}
                onClick={() => setApprovalType("unlimited")}
              >
                Unlimited
              </button>
              <button
                style={{
                  ...styles.radioOption,
                  ...(approvalType === "exact" ? styles.radioOptionActive : {}),
                }}
                onClick={() => setApprovalType("exact")}
              >
                Exact Amount
              </button>
            </div>
            {approvalType === "unlimited" && (
              <div style={styles.warningBanner}>
                Unlimited approval allows Dex Gecko to spend your full token balance.
                You can revoke this approval anytime from the Approvals dashboard.
              </div>
            )}
            {!tokenIn.isNative && currentAllowance > 0n && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "var(--foreground-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    display: "inline-block",
                  }}
                />
                Current allowance:{" "}
                {currentAllowance >= ethers.MaxUint256 - 1n
                  ? "Unlimited"
                  : parseFloat(ethers.formatUnits(currentAllowance, tokenIn.decimals)).toFixed(4)}
              </div>
            )}
          </div>
        )}

        {/* Swap Button */}
        <button
          style={{
            ...styles.swapBtn,
            ...(isSwapDisabled ? styles.swapBtnDisabled : styles.swapBtnPrimary),
          }}
          disabled={isSwapDisabled}
          onClick={handleSwap}
          onMouseEnter={(e) => {
            if (!isSwapDisabled) e.target.style.background = "var(--primary-hover)";
          }}
          onMouseLeave={(e) => {
            if (!isSwapDisabled) e.target.style.background = "var(--primary)";
          }}
        >
          {isLoading && <span className="spinner" />}
          {getSwapButtonText()}
        </button>

        {/* Status */}
        {status && (
          <div
            style={{
              ...styles.statusBar,
              background:
                statusType === "success"
                  ? "rgba(34, 197, 94, 0.1)"
                  : statusType === "error"
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(34, 197, 94, 0.05)",
              color:
                statusType === "success"
                  ? "var(--primary)"
                  : statusType === "error"
                  ? "var(--destructive)"
                  : "var(--foreground-muted)",
              border: `1px solid ${
                statusType === "success"
                  ? "rgba(34, 197, 94, 0.2)"
                  : statusType === "error"
                  ? "rgba(239, 68, 68, 0.2)"
                  : "var(--border)"
              }`,
            }}
            className="animate-fade-in"
          >
            {statusType === "success" && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.28 5.22a.75.75 0 00-1.06 0L7 8.44 5.78 7.22a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.75-3.75a.75.75 0 000-1.06z" />
              </svg>
            )}
            {statusType === "error" && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 4zm0 8a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            )}
            {statusType === "info" && <span className="spinner" style={{ width: "14px", height: "14px" }} />}
            {status}
          </div>
        )}
      </div>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <TokenSelector
          tokens={tokens}
          onSelect={handleTokenSelect}
          onClose={() => setShowTokenSelector(null)}
          selectedToken={showTokenSelector === "in" ? tokenIn : tokenOut}
        />
      )}
    </div>
  );
}
