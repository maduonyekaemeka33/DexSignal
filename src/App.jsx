import React, { useState } from "react";
import { WalletProvider } from "./context/WalletContext";
import Header from "./components/Header";
import SwapPage from "./components/SwapPage";
import MemeCoinDashboard from "./components/MemeCoinDashboard";
import DexScreenerIframe from "./components/DexScreenerIframe";
import ApprovalManager from "./components/ApprovalManager";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("swap");

  const renderPage = () => {
    switch (currentPage) {
      case "swap":
        return <SwapPage />;
      case "dashboard":
        return (
          <div style={{ padding: "20px 16px", maxWidth: "1200px", margin: "0 auto" }}>
            <MemeCoinDashboard />
          </div>
        );
      case "charts":
        return (
          <div style={{ padding: "20px 16px", maxWidth: "1200px", margin: "0 auto" }}>
            <DexScreenerIframe />
          </div>
        );
      case "approvals":
        return <ApprovalManager />;
      default:
        return <SwapPage />;
    }
  };

  return (
    <>
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main style={{ flex: 1, paddingTop: "20px", paddingBottom: "40px" }}>
        {renderPage()}
      </main>
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          borderTop: "1px solid var(--border)",
          fontSize: "13px",
          color: "var(--foreground-muted)",
        }}
      >
        Dex Gecko &mdash; Decentralized Exchange
      </footer>
    </>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
