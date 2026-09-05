import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Licenses from "./pages/Licenses";
import Activations from "./pages/Activations";
import Events from "./pages/Events";
import SettingsPage from "./pages/Settings";
import { observeAuth, logout } from "./services/auth.service";
import {
  listLicenses,
  listActivations,
  listEvents,
} from "./services/license.service";
import type { License, LicenseActivation, LicenseEvent } from "./types/license";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [activations, setActivations] = useState<LicenseActivation[]>([]);
  const [events, setEvents] = useState<LicenseEvent[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  useEffect(
    () =>
      observeAuth((u) => {
        setUser(u);
        setReady(true);
      }),
    [],
  );
  async function refresh() {
    setError("");
    try {
      setLicenses(await listLicenses());
      setActivations(await listActivations());
      setEvents(await listEvents());
      setRefreshKey((x) => x + 1);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Unable to load license data.",
      );
    }
  }
  useEffect(() => {
    if (user) void refresh();
  }, [user]);
  if (!ready) return <div className="loading">Loading...</div>;
  if (!user) return <Login onLogin={() => {}} />;
  if (error)
    return (
      <div className="error-screen">
        <h1>Unable to load license data</h1>
        <p>{error}</p>
        <button onClick={() => void refresh()}>Retry</button>
      </div>
    );
  return (
    <div className="app-shell">
      <Sidebar active={page} onChange={setPage} onLogout={() => logout()} />
      <main className="main">
        {page === "dashboard" && (
          <Dashboard
            licenses={licenses}
            activations={activations}
            events={events}
          />
        )}
        {page === "licenses" && (
          <Licenses licenses={licenses} onRefresh={refresh} />
        )}
        {page === "activations" && <Activations refreshKey={refreshKey} />}
        {page === "events" && <Events refreshKey={refreshKey} />}
        {page === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}
