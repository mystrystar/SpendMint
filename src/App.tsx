import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useRenewalNotifications } from "./hooks/useRenewalNotifications";
import { useVaultwise } from "./hooks/useVaultwise";
import { AddSubscription } from "./pages/AddSubscription";
import { Analytics } from "./pages/Analytics";
import { Content } from "./pages/Content";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { Settings } from "./pages/Settings";
import { SubscriptionDetail } from "./pages/SubscriptionDetail";
import { Vault } from "./pages/Vault";

export default function App() {
  const { data, preferences } = useVaultwise();
  const location = useLocation();
  useRenewalNotifications(data?.subscriptions ?? [], preferences);

  return (
    <ErrorBoundary>
      <Routes location={location}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddSubscription />} />
          <Route path="/subscription/:id" element={<SubscriptionDetail />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/content" element={<Content />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
