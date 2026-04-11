import { DiscoveryPage } from "@/features/discovery/DiscoveryPage";
import { AppProviders } from "@/providers/AppProviders";

export function App() {
  return (
    <AppProviders>
      <DiscoveryPage />
    </AppProviders>
  );
}

export default App;
