import { ErrorPage } from "../common/error-page";
import { AcceptanceRate } from "./charts/acceptance-rate";
import { ActiveUsers } from "./charts/active-users";
import { Editor } from "./charts/editor";
import { Language } from "./charts/language";
import { Stats } from "./charts/stats";
import { TotalCodeLineSuggestionsAndAcceptances } from "./charts/total-code-line-suggestions-and-acceptances";
import { TotalSuggestionsAndAcceptances } from "./charts/total-suggestions-and-acceptances";
import { DataProvider } from "./dashboard-state";
import { TimeFrameToggle } from "./filter/time-frame-toggle";
import { Header } from "./header";
import { getCopilotMetricsForOrgs } from "./services/copilot-metrics-service";
import { getCopilotSeatsForOrgs } from "./services/copilot-seat-service";

export default async function Dashboard() {
  const allDataPromise = getCopilotMetricsForOrgs();
  const usagePromise = getCopilotSeatsForOrgs();

  const [allData, usage] = await Promise.all([allDataPromise, usagePromise]);

  if (allData.status !== "OK") {
    return <ErrorPage error={allData.errors[0].message} />;
  }

  if (usage.status !== "OK") {
    return <ErrorPage error={usage.errors[0].message} />;
  }

  return (
    <DataProvider
      copilotUsages={allData.response}
      seatManagement={usage.response}
    >
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
    </DataProvider>
  );
}
