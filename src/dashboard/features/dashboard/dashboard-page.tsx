import { AcceptanceRate } from "./charts/acceptance-rate";
import { ActiveUsers } from "./charts/active-users";
import { Editor } from "./charts/editor";
import { Language } from "./charts/language";
import { Stats } from "./charts/stats";
import { TotalCodeLineSuggestionsAndAcceptances } from "./charts/total-code-line-suggestions-and-acceptances";
import { TotalSuggestionsAndAcceptances } from "./charts/total-suggestions-and-acceptances";
import { getCopilotMetrics } from "./copilot-metrics-service";
import { DashboardProvider } from "./dashboard-state";
import { Header } from "./header";

export default async function Dashboard() {
  const allData = await getCopilotMetrics();
  return (
    <DashboardProvider apiData={allData}>
      <main className="flex flex-1 flex-col gap-4 md:gap-8 pb-8">
        <Header />

        <div className="mx-auto w-full max-w-6xl container">
          <div className="grid grid-cols-4 gap-6">
            <Stats />
            <AcceptanceRate />
            <Language />
            <Editor />
            <ActiveUsers />
            <TotalCodeLineSuggestionsAndAcceptances />
            <TotalSuggestionsAndAcceptances />
          </div>
        </div>
      </main>
    </DashboardProvider>
  );
}
