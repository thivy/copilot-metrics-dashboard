import { AcceptanceRate } from "./charts/acceptance-rate";
import { ActiveUsers } from "./charts/active-users";
import { Editor } from "./charts/editor";
import { Language } from "./charts/language";
import { Stats } from "./charts/stats";
import { TotalCodeLineSuggestionsAndAcceptances } from "./charts/total-code-line-suggestions-and-acceptances";
import { TotalSuggestionsAndAcceptances } from "./charts/total-suggestions-and-acceptances";
import { getCopilotMetrics } from "./copilot-metrics-service";
import { DashboardProvider } from "./dashboard-state";
import { TimeFrameProvider, TimeFrameToggle } from "./filter/time-frame-toggle";
import { Header } from "./header";

export default async function Dashboard() {
  const allData = await getCopilotMetrics();
  return (
    <TimeFrameProvider>
      <DashboardProvider apiData={allData}>
        <main className="flex flex-1 flex-col gap-4 md:gap-8 pb-8">
          <Header />

          <div className="mx-auto w-full max-w-6xl container">
            <div className="grid grid-cols-4 gap-6">
              <Stats />
              <div className="flex justify-end col-span-full">
                <TimeFrameToggle />
              </div>
              <AcceptanceRate />
              <TotalCodeLineSuggestionsAndAcceptances />
              <TotalSuggestionsAndAcceptances />
              <Language />
              <Editor />
              <ActiveUsers />
            </div>
          </div>
        </main>
      </DashboardProvider>
    </TimeFrameProvider>
  );
}
