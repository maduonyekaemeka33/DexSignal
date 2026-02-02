import '@solana/wallet-adapter-react-ui/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
title: 'Dex Signal - Live Meme Coin Finder & DEX Swaps on Solana & Ethereum',
description:
'Dex Signal: Real-time scanner for new and trending meme coins on Solana and Ethereum. Discover live launches, get early signals, and swap instantly via Jupiter DEX. Find the next 100x gem today!',
keywords: [
'dex signal',
'meme coins',
'new meme coin finder',
'solana meme coins',
'ethereum meme coins',
'jupiter dex swap',
'live coin scanner',
'crypto signals',
'dex tools',
],
robots: 'index, follow',
alternates: { canonical: 'https://dex-signal.vercel.app/' },
openGraph: {
title: 'Dex Signal - Live Meme Coin Finder & Swaps',
description:
'Discover trending new meme coins in real-time on Solana & Ethereum. Get Dex Signal alerts and swap via Jupiter DEX. Don't miss the next big launch!',
url: 'https://dex-signal.vercel.app/',
siteName: 'Dex Signal',
images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
type: 'website',
},
twitter: {
card: 'summary_large_image',
title: 'Dex Signal - Live Meme Coin Finder & Swaps',
description:
'Real-time Dex Signal for new Solana & Ethereum meme coins. Scan, discover, and swap trending tokens instantly.',
images: ['/og-image.jpg'],
},
icons: { icon: '/favicon.ico' },
viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (

<html lang="en">  
<body>{children}</body>  
</html>  
);  
  }
