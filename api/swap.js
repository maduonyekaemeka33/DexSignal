export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });
  
  const { quoteResponse, userPublicKey } = req.body;
  
  // CRITICAL: Replace with your Referral Key from referral.jup.ag
  const REFERRAL_ACCOUNT_KEY = "PASTE_YOUR_REFERRAL_KEY_HERE"; 

  try {
    const response = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        feeAccount: REFERRAL_ACCOUNT_KEY, 
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto" 
      })
    });
    const result = await response.json();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: "Transaction generation failed" });
  }
}
