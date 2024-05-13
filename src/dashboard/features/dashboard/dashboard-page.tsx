import { getData } from "./api-data";
import { AcceptanceCount } from "./charts/acceptance-count";
import { AcceptanceRate } from "./charts/acceptance-rate";
import { AcceptanceSuggestionsCount } from "./charts/acceptance-suggestions-count";
import { Language } from "./charts/language";
import { DashboardProvider } from "./dashboard-state";
import { ComboboxPopover, Header } from "./header";
import StatsCard from "./stats-card";

export default async function Dashboard() {
  const allData = await getData();
  return (
    <DashboardProvider apiData={allData}>
      <main className="flex flex-1 flex-col gap-4 md:gap-8 pb-8">
        <Header />
        <ComboboxPopover />

        <div className="mx-auto w-full max-w-6xl container">
          <div className="grid grid-cols-4 gap-6">
            <StatsCard
              title="last 10 days"
              description="Acceptance rate average"
              value="22.19%"
            />
            <StatsCard
              title="last 10 days"
              description="Total accepted suggestions"
              value="199097"
            />
            <StatsCard
              title="last 10 days"
              description="Total accepted prompts"
              value="50734"
            />
            <StatsCard
              title="last 10 days"
              description="Total lines of code accepted."
              value="94735"
            />
            <AcceptanceCount />
            <AcceptanceRate />
            <AcceptanceSuggestionsCount />
            <Language /> <Language />
          </div>
        </div>
      </main>
    </DashboardProvider>
  );
}
