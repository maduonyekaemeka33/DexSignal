// ============================================================
// TOKEN CONSTANTS & ABI DEFINITIONS
// Contains per-chain token lists, router addresses,
// wrapped native token addresses, and contract ABIs.
// ============================================================

/** Common tokens per chainId. The first entry on each chain
 *  is the native gas token (isNative: true). */
export const COMMON_TOKENS = {
  // ---------- Ethereum Mainnet ----------
  1: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
    },
    {
      symbol: "WBTC",
      name: "Wrapped BTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      decimals: 18,
    },
  ],

  // ---------- BNB Smart Chain ----------
  56: [
    {
      symbol: "BNB",
      name: "BNB",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
    },
    {
      symbol: "WBNB",
      name: "Wrapped BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
    },
    {
      symbol: "BUSD",
      name: "Binance USD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      decimals: 18,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
    },
    {
      symbol: "CAKE",
      name: "PancakeSwap",
      address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      decimals: 18,
    },
  ],

  // ---------- Polygon ----------
  137: [
    {
      symbol: "MATIC",
      name: "Polygon",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
    },
    {
      symbol: "WMATIC",
      name: "Wrapped MATIC",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
    },
  ],

  // ---------- Arbitrum ----------
  42161: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      decimals: 18,
    },
  ],

  // ---------- Base ----------
  8453: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
    },
  ],
};

// ============================================================
// ROUTER ADDRESSES (Uniswap V2 / PancakeSwap V2 style)
// ============================================================
export const ROUTER_ADDRESSES = {
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",      // Uniswap V2
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",     // PancakeSwap V2
  137: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",    // QuickSwap
  42161: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",  // SushiSwap
  8453: "0x2626664c2603336E57B271c5C0b26F421741e481",    // BaseSwap
};

// ============================================================
// WRAPPED NATIVE TOKEN ADDRESS per chain
// Used to build swap paths (native <-> ERC-20).
// ============================================================
export const WRAPPED_NATIVE = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",      // WETH
  56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",     // WBNB
  137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",    // WMATIC
  42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",   // WETH
  8453: "0x4200000000000000000000000000000000000006",     // WETH
};

// ============================================================
// ERC-20 ABI (read/write functions we need)
// ============================================================
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
];

// ============================================================
// UNISWAP V2 ROUTER ABI (all swap variants + getAmountsOut)
// Includes "SupportingFeeOnTransferTokens" versions for
// tokens that have a transfer tax / fee.
// ============================================================
export const ROUTER_ABI = [
  // --- read ---
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function WETH() external pure returns (address)",

  // --- standard swaps ---
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",

  // --- fee-on-transfer / tax token swaps ---
  "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
];
