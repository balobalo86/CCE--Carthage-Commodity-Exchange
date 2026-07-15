import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { MarketProvider } from "./lib/MarketContext";
import { ToastProvider } from "./lib/ToastContext";
import MarketsPage from "./pages/MarketsPage";
import OptionsPage from "./pages/OptionsPage";
import SwapsPage from "./pages/SwapsPage";
import EtfPage from "./pages/EtfPage";
import PortfolioPage from "./pages/PortfolioPage";
import SpecsPage from "./pages/SpecsPage";
import MarketDataPage from "./pages/MarketDataPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import CompliancePage from "./pages/CompliancePage";
import HelpPage from "./pages/HelpPage";

export default function App() {
  return (
    <MarketProvider>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<MarketsPage />} />
            <Route path="options" element={<OptionsPage />} />
            <Route path="swaps" element={<SwapsPage />} />
            <Route path="etf" element={<EtfPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="specs" element={<SpecsPage />} />
            <Route path="market-data" element={<MarketDataPage />} />
            <Route path="participants" element={<ParticipantsPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </MarketProvider>
  );
}
