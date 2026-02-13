// ============================================================
// SwapPage.jsx  –  Dex Gecko Swap Interface
//
// Features implemented:
//  1. Paste any token contract address from DexScreener
//  2. Wallet connection via WalletContext (MetaMask / WalletConnect)
//  3. Dynamic token info fetching (symbol, decimals, allowance)
//  4. Unlimited / exact approval toggle
//  5. getAmountsOut quote calculation for estimated output
//  6. Standard Uniswap V2-style swap execution
//  7. Multi-chain support (Ethereum, BSC, Base, Polygon, Arbitrum)
//  8. Detailed error handling (no liquidity, honeypot, tax, etc.)
//  9. Clean UI with all swap controls
// 10. ethers.js v6 compatible
// 11. Pre-fill support via onPrefillToken prop
// 12. Full async/await with tx confirmation
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import {
  COMMON_TOKENS,
  ROUTER_ADDRESSES,
  WRAPPED_NATIVE,
  ERC20_ABI,
  ROUTER_ABI,
} from "../constants/tokens";
import TokenSelector from "./TokenSelector";

// ----- Inline style objects -----
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
  title: { fontSize: "18px", fontWeight: "700", color: "var(--foreground)" },
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
  label: {
    fontSize: "13px",
    color: "var(--foreground-muted)",
    marginBottom: "8px",
    display: "block",
  },
  inputRow: { display: "flex", alignItems: "center", gap: "12px" },
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
  radioGroup: { display: "flex", gap: "8px" },
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
  swapBtnPrimary: { background: "var(--primary)", color: "var(--background)" },
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
  quoteRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: "var(--foreground-muted)",
    padding: "8px 0",
  },
  quoteLabel: { opacity: 0.8 },
  quoteValue: { fontWeight: "600", color: "var(--foreground)" },
  detailsCard: {
    marginTop: "12px",
    padding: "12px 14px",
    background: "var(--input-bg)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    fontSize: "13px",
  },
  feeToggle: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "var(--foreground-muted)",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "var(--primary)",
    width: "14px",
    height: "14px",
    cursor: "pointer",
  },
};

// ============================================================
// HELPER: classify error messages into user-friendly strings
// ============================================================
function classifySwapError(err) {
  const msg = (err.reason || err.message || "").toLowerCase();

  if (err.code === "ACTION_REJECTED" || msg.includes("user rejected") || msg.includes("user denied"))
    return "Transaction rejected by user";
  if (msg.includes("insufficient_output_amount") || msg.includes("insufficient output"))
    return "Insufficient output amount -- the price moved. Try increasing slippage.";
  if (msg.includes("insufficient_liquidity") || msg.includes("insufficient liquidity") || msg.includes("ds-math-sub-underflow"))
    return "No liquidity available for this pair. The pool may be empty or the token is a honeypot.";
  if (msg.includes("transfer_from_failed") || msg.includes("transferfrom failed") || msg.includes("transfer failed"))
    return "Token transfer failed. The token may have a transfer tax, be a honeypot, or restrict transfers.";
  if (msg.includes("execution reverted") && msg.includes("pancake"))
    return "PancakeSwap router reverted. The token may have high tax or be a honeypot.";
  if (msg.includes("expired") || msg.includes("deadline"))
    return "Transaction deadline expired. Please try again.";
  if (msg.includes("insufficient funds") || msg.includes("insufficient balance"))
    return "Insufficient funds to cover gas + amount.";
  if (msg.includes("execution reverted"))
    return "Transaction reverted. The token may restrict trading, have high tax, or be a honeypot.";
  if (msg.includes("cannot estimate gas") || msg.includes("unpredictable_gas_limit"))
    return "Cannot estimate gas. The token may block swaps (honeypot) or have a very high tax.";

  return "Swap failed: " + (err.reason || err.message || "Unknown error");
}

// ============================================================
// COMPONENT
// ============================================================
export default function SwapPage({ prefillTokenAddress }) {
  const { signer, account, chainId, provider } = useWallet();

  // --- Token & amount state ---
  const [tokenIn, setTokenIn] = useState(null);
  const [tokenOut, setTokenOut] = useState(null);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");        // estimated output from getAmountsOut
  const [balanceIn, setBalanceIn] = useState("0");
  const [balanceOut, setBalanceOut] = useState("0");

  // --- Approval state ---
  const [approvalType, setApprovalType] = useState("unlimited"); // "unlimited" | "exact"
  const [currentAllowance, setCurrentAllowance] = useState(0n);

  // --- Settings ---
  const [slippage, setSlippage] = useState("1.0");       // default 1%
  const [isFeeOnTransfer, setIsFeeOnTransfer] = useState(false); // toggle for tax tokens
  const [showSettings, setShowSettings] = useState(false);

  // --- UI state ---
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");       // "info" | "success" | "error"
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(null); // "in" | "out" | null

  // --- Derived chain data ---
  const tokens = COMMON_TOKENS[chainId] || COMMON_TOKENS[1];
  const routerAddress = ROUTER_ADDRESSES[chainId] || ROUTER_ADDRESSES[1];
  const wrappedNative = WRAPPED_NATIVE[chainId] || WRAPPED_NATIVE[1];

  // Debounce ref for quote fetching
  const quoteTimerRef = useRef(null);

  // ============================================================
  // Step 1: Set default tokens when chain changes
  // ============================================================
  useEffect(() => {
    if (tokens.length >= 2) {
      setTokenIn(tokens[0]);  // native token
      setTokenOut(tokens[1]); // wrapped native / first ERC-20
    }
    setAmountIn("");
    setAmountOut("");
  }, [chainId]);

  // ============================================================
  // Step 1b: Handle prefillTokenAddress from DexScreener dashboard
  // ============================================================
  useEffect(() => {
    if (!prefillTokenAddress || !provider) return;

    const loadPrefill = async () => {
      // If it looks like a valid address, load its info and set as tokenOut
      if (!ethers.isAddress(prefillTokenAddress)) return;
      try {
        const contract = new ethers.Contract(prefillTokenAddress, ERC20_ABI, provider);
        const [symbol, name, decimals] = await Promise.all([
          contract.symbol(),
          contract.name(),
          contract.decimals(),
        ]);
        setTokenOut({
          symbol,
          name,
          address: prefillTokenAddress,
          decimals: Number(decimals),
        });
      } catch {
        // silently fail – token may not exist on this chain
      }
    };
    loadPrefill();
  }, [prefillTokenAddress, provider]);

  // ============================================================
  // Step 2: Fetch balances for tokenIn and tokenOut
  // ============================================================
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

  // ============================================================
  // Step 3: Check current allowance for tokenIn
  // ============================================================
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

  // ============================================================
  // Step 4: Build the swap path for the router
  //   - If one side is native, replace with WETH/WBNB
  //   - If neither is native, route through WETH/WBNB as intermediary
  // ============================================================
  const buildPath = useCallback(() => {
    if (!tokenIn || !tokenOut) return [];
    const addrIn = tokenIn.isNative ? wrappedNative : tokenIn.address;
    const addrOut = tokenOut.isNative ? wrappedNative : tokenOut.address;

    // If same address, no valid path
    if (addrIn.toLowerCase() === addrOut.toLowerCase()) return [];

    // Direct path first – if one of them is the wrapped native we can go direct
    if (
      addrIn.toLowerCase() === wrappedNative.toLowerCase() ||
      addrOut.toLowerCase() === wrappedNative.toLowerCase()
    ) {
      return [addrIn, addrOut];
    }

    // Otherwise route through wrapped native as intermediary
    return [addrIn, wrappedNative, addrOut];
  }, [tokenIn, tokenOut, wrappedNative]);

  // ============================================================
  // Step 5: Fetch estimated output using getAmountsOut (debounced)
  // ============================================================
  useEffect(() => {
    // Clear any pending quote timer
    if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);

    if (!amountIn || parseFloat(amountIn) <= 0 || !tokenIn || !tokenOut || !provider) {
      setAmountOut("");
      return;
    }

    const path = buildPath();
    if (path.length === 0) {
      setAmountOut("");
      return;
    }

    // Debounce 400ms so we don't spam the RPC on every keystroke
    quoteTimerRef.current = setTimeout(async () => {
      setIsQuoting(true);
      try {
        const router = new ethers.Contract(routerAddress, ROUTER_ABI, provider);
        const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);

        // Call getAmountsOut – returns an array where the last element
        // is the estimated output amount in the output token's smallest unit
        const amounts = await router.getAmountsOut(amountInWei, path);
        const estimatedOut = amounts[amounts.length - 1];
        setAmountOut(ethers.formatUnits(estimatedOut, tokenOut.decimals));
      } catch {
        // getAmountsOut can fail if there's no liquidity
        setAmountOut("--");
      } finally {
        setIsQuoting(false);
      }
    }, 400);

    return () => { if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current); };
  }, [amountIn, tokenIn, tokenOut, provider, routerAddress, buildPath]);

  // ============================================================
  // Step 6: Determine if approval is needed
  // ============================================================
  const needsApproval = useCallback(() => {
    if (!tokenIn || tokenIn.isNative || !amountIn) return false;
    try {
      const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);
      return currentAllowance < amountInWei;
    } catch {
      return false;
    }
  }, [tokenIn, amountIn, currentAllowance]);

  // ============================================================
  // Step 7: Approve token – unlimited = MaxUint256, exact = parsed amount
  // ============================================================
  async function approveToken() {
    if (!signer || !tokenIn) return;
    try {
      const token = new ethers.Contract(tokenIn.address, ERC20_ABI, signer);
      let approveAmount;

      if (approvalType === "unlimited") {
        // Full unlimited approval: MaxUint256
        // = 115792089237316195423570985008687907853269984665640564039457584007913129639935
        approveAmount = ethers.MaxUint256;
      } else {
        // Exact amount approval
        approveAmount = ethers.parseUnits(amountIn, tokenIn.decimals);
      }

      setStatus("Waiting for approval signature...");
      setStatusType("info");

      // Send the approve transaction and wait for confirmation
      const tx = await token.approve(routerAddress, approveAmount);
      setStatus("Approval transaction pending...");
      await tx.wait();

      // Re-read the on-chain allowance to confirm
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
      throw err; // re-throw so the caller (handleSwap) can stop
    }
  }

  // ============================================================
  // Step 8: Ensure approval before swap
  // ============================================================
  async function ensureApproval() {
    if (!tokenIn || tokenIn.isNative) return;

    const token = new ethers.Contract(tokenIn.address, ERC20_ABI, signer);
    const allowance = await token.allowance(account, routerAddress);

    if (approvalType === "unlimited") {
      // For unlimited, approve only if allowance is zero
      if (allowance === 0n) {
        await approveToken();
      }
    } else {
      // For exact, approve if current allowance < swap amount
      const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);
      if (allowance < amountInWei) {
        await approveToken();
      }
    }
  }

  // ============================================================
  // Step 9: Execute the swap transaction
  // ============================================================
  async function handleSwap() {
    if (!signer || !tokenIn || !tokenOut || !amountIn) return;

    setIsLoading(true);
    try {
      // Step 9a: Check + prompt approval
      setStatus("Checking allowance...");
      setStatusType("info");
      await ensureApproval();

      // Step 9b: Build the swap parameters
      setStatus("Preparing swap...");
      setStatusType("info");

      const router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);
      const amountInWei = ethers.parseUnits(amountIn, tokenIn.decimals);
      const path = buildPath();

      // Deadline = current timestamp + 10 minutes
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      // Slippage: calculate minAmountOut from the quoted amountOut
      const slippagePercent = parseFloat(slippage) || 1.0;
      let minAmountOut = 0n;
      if (amountOut && amountOut !== "--") {
        const estimatedOutWei = ethers.parseUnits(amountOut, tokenOut.decimals);
        // minAmountOut = estimatedOut * (100 - slippage) / 100
        minAmountOut = (estimatedOutWei * BigInt(Math.floor((100 - slippagePercent) * 100))) / 10000n;
      }

      // Step 9c: Pick the right swap function
      let tx;

      if (tokenIn.isNative) {
        // ETH/BNB -> Token
        if (isFeeOnTransfer) {
          tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
            minAmountOut, path, account, deadline,
            { value: amountInWei }
          );
        } else {
          tx = await router.swapExactETHForTokens(
            minAmountOut, path, account, deadline,
            { value: amountInWei }
          );
        }
      } else if (tokenOut.isNative) {
        // Token -> ETH/BNB
        if (isFeeOnTransfer) {
          tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountInWei, minAmountOut, path, account, deadline
          );
        } else {
          tx = await router.swapExactTokensForETH(
            amountInWei, minAmountOut, path, account, deadline
          );
        }
      } else {
        // Token -> Token
        if (isFeeOnTransfer) {
          tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountInWei, minAmountOut, path, account, deadline
          );
        } else {
          tx = await router.swapExactTokensForTokens(
            amountInWei, minAmountOut, path, account, deadline
          );
        }
      }

      // Step 9d: Wait for transaction confirmation
      setStatus("Swap transaction pending...");
      const receipt = await tx.wait();
      setStatus(`Swap successful! Tx: ${receipt.hash.slice(0, 10)}...`);
      setStatusType("success");

      // Step 9e: Refresh balances
      fetchBalance(tokenIn, setBalanceIn);
      fetchBalance(tokenOut, setBalanceOut);
      setAmountIn("");
      setAmountOut("");
    } catch (err) {
      console.error("Swap error:", err);
      setStatus(classifySwapError(err));
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  }

  // ============================================================
  // Step 10: Swap token positions (In <-> Out)
  // ============================================================
  function handleSwapTokens() {
    const tempToken = tokenIn;
    const tempBalance = balanceIn;
    setTokenIn(tokenOut);
    setTokenOut(tempToken);
    setBalanceIn(balanceOut);
    setBalanceOut(tempBalance);
    setAmountIn(amountOut && amountOut !== "--" ? amountOut : "");
    setAmountOut("");
  }

  // ============================================================
  // Step 11: Handle token selection from modal
  // ============================================================
  function handleTokenSelect(token) {
    if (showTokenSelector === "in") {
      if (tokenOut && token.address.toLowerCase() === tokenOut.address.toLowerCase()) {
        handleSwapTokens();
      } else {
        setTokenIn(token);
      }
    } else {
      if (tokenIn && token.address.toLowerCase() === tokenIn.address.toLowerCase()) {
        handleSwapTokens();
      } else {
        setTokenOut(token);
      }
    }
    setShowTokenSelector(null);
  }

  // ============================================================
  // Computed: button text & disabled state
  // ============================================================
  const getSwapButtonText = () => {
    if (!account) return "Connect Wallet";
    if (!tokenIn || !tokenOut) return "Select Tokens";
    if (!amountIn || parseFloat(amountIn) === 0) return "Enter Amount";
    if (parseFloat(amountIn) > parseFloat(balanceIn)) return "Insufficient Balance";
    if (isLoading) return "";
    if (needsApproval()) return "Approve & Swap";
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

  // Computed: minimum received after slippage
  const minReceived = (() => {
    if (!amountOut || amountOut === "--") return null;
    const slippagePercent = parseFloat(slippage) || 1.0;
    const raw = parseFloat(amountOut) * (1 - slippagePercent / 100);
    return raw > 0 ? raw.toFixed(6) : null;
  })();

  // Computed: price per token
  const pricePerToken = (() => {
    if (!amountIn || !amountOut || amountOut === "--") return null;
    const rate = parseFloat(amountOut) / parseFloat(amountIn);
    if (!isFinite(rate) || rate === 0) return null;
    return rate.toFixed(6);
  })();

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* --- Header --- */}
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

        {/* --- Settings panel (slippage + fee-on-transfer) --- */}
        {showSettings && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ ...styles.slippageRow, marginTop: 0 }}>
              <span>Slippage Tolerance</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {["0.5", "1.0", "3.0", "5.0"].map((val) => (
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

            {/* Fee-on-transfer toggle for tax tokens */}
            <label style={styles.feeToggle}>
              <input
                type="checkbox"
                checked={isFeeOnTransfer}
                onChange={(e) => setIsFeeOnTransfer(e.target.checked)}
                style={styles.checkbox}
              />
              <span>
                Tax token mode
                <span style={{ marginLeft: "4px", opacity: 0.6 }}>
                  (enable for tokens with buy/sell tax)
                </span>
              </span>
            </label>
          </div>
        )}

        {/* --- Token In (You Pay) --- */}
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
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {tokenIn ? tokenIn.symbol : "Select"}
              <svg width="12" height="12" viewBox="0 0 12 12">
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

        {/* --- Swap Direction Arrow --- */}
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

        {/* --- Token Out (You Receive) --- */}
        <div style={styles.tokenInput}>
          <span style={styles.label}>You Receive</span>
          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder={isQuoting ? "Fetching quote..." : "0.0"}
              value={isQuoting ? "" : amountOut}
              style={{ ...styles.amountInput, color: "var(--foreground-muted)" }}
              readOnly
              aria-label="Estimated amount to receive"
            />
            <button
              style={styles.tokenBtn}
              onClick={() => setShowTokenSelector("out")}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {tokenOut ? tokenOut.symbol : "Select"}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          </div>
          <div style={styles.balanceRow}>
            <span>Balance: {parseFloat(balanceOut).toFixed(6)}</span>
            {isQuoting && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="spinner" style={{ width: "12px", height: "12px" }} />
                <span style={{ fontSize: "11px" }}>Quoting...</span>
              </span>
            )}
          </div>
        </div>

        {/* --- Quote Details (price, min received, path) --- */}
        {amountOut && amountOut !== "--" && amountOut !== "" && (
          <div style={styles.detailsCard}>
            {pricePerToken && (
              <div style={styles.quoteRow}>
                <span style={styles.quoteLabel}>Rate</span>
                <span style={styles.quoteValue}>
                  1 {tokenIn?.symbol} = {pricePerToken} {tokenOut?.symbol}
                </span>
              </div>
            )}
            {minReceived && (
              <div style={styles.quoteRow}>
                <span style={styles.quoteLabel}>
                  Min. received ({slippage}% slippage)
                </span>
                <span style={styles.quoteValue}>
                  {minReceived} {tokenOut?.symbol}
                </span>
              </div>
            )}
            <div style={styles.quoteRow}>
              <span style={styles.quoteLabel}>Route</span>
              <span style={styles.quoteValue}>
                {buildPath().length === 3
                  ? `${tokenIn?.symbol} > ${tokens.find(t => t.address?.toLowerCase() === wrappedNative.toLowerCase())?.symbol || "WETH"} > ${tokenOut?.symbol}`
                  : `${tokenIn?.symbol} > ${tokenOut?.symbol}`}
              </span>
            </div>
            {isFeeOnTransfer && (
              <div style={{ ...styles.quoteRow, color: "var(--warning)" }}>
                <span>Tax token mode</span>
                <span style={{ fontWeight: "600" }}>Enabled</span>
              </div>
            )}
          </div>
        )}

        {/* --- No liquidity warning --- */}
        {amountOut === "--" && amountIn && parseFloat(amountIn) > 0 && (
          <div style={{ ...styles.warningBanner, marginTop: "12px" }}>
            No liquidity found for this pair on the current chain. The token may not
            have a pool, or it could be a honeypot. Try switching chains or tokens.
          </div>
        )}

        {/* --- Approval Type Toggle --- */}
        {tokenIn && !tokenIn.isNative && amountIn && parseFloat(amountIn) > 0 && (
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

            {/* Warning when unlimited is selected */}
            {approvalType === "unlimited" && (
              <div style={styles.warningBanner}>
                Unlimited approval allows Dex Gecko to spend your full token balance.
                You can revoke this approval anytime from the Approvals dashboard.
              </div>
            )}

            {/* Show current on-chain allowance */}
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

        {/* --- Swap Button --- */}
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

        {/* --- Status Messages --- */}
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
            {statusType === "info" && (
              <span className="spinner" style={{ width: "14px", height: "14px" }} />
            )}
            <span style={{ lineHeight: "1.4" }}>{status}</span>
          </div>
        )}
      </div>

      {/* --- Token Selector Modal --- */}
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
