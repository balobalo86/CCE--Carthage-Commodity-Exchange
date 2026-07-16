import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./lib/AuthContext";
import { AccountProvider } from "./lib/AccountContext";
import { MarketProvider } from "./lib/MarketContext";
import { ToastProvider } from "./lib/ToastContext";
import MarketsPage from "./pages/MarketsPage";
import FuturesPage from "./pages/FuturesPage";
import OptionsPage from "./pages/OptionsPage";
import SwapsPage from "./pages/SwapsPage";
import EtfPage from "./pages/EtfPage";
import PortfolioPage from "./pages/PortfolioPage";
import SpecsPage from "./pages/SpecsPage";
import MarketDataPage from "./pages/MarketDataPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import CompliancePage from "./pages/CompliancePage";
import HelpPage from "./pages/HelpPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
  return (
    <AuthProvider>
      <AccountProvider>
        <MarketProvider>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<MarketsPage />} />
                <Route path="futures" element={<FuturesPage />} />
                <Route path="options" element={<OptionsPage />} />
                <Route path="swaps" element={<SwapsPage />} />
                <Route path="etf" element={<EtfPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="specs" element={<SpecsPage />} />
                <Route path="market-data" element={<MarketDataPage />} />
                <Route path="participants" element={<ParticipantsPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="sign-in" element={<SignInPage />} />
                <Route path="sign-up" element={<SignUpPage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </MarketProvider>
      </AccountProvider>
    </AuthProvider>
  );
}
