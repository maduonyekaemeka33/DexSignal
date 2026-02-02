export default async function handler(req, res) {
  const { inputMint, outputMint, amount } = req.query;
  // 20 = 0.2%. Change this to your preferred fee (Max 100 bps)
  const PLATFORM_FEE_BPS = 20; 

  try {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&platformFeeBps=${PLATFORM_FEE_BPS}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Jupiter Quote Fetch Failed" });
  }
}
