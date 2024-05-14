import { getData } from "./api-data";
import { AcceptanceCount } from "./charts/acceptance-count";
import { AcceptanceRate } from "./charts/acceptance-rate";
import { AcceptanceSuggestionsCount } from "./charts/acceptance-suggestions-count";
import { Editor } from "./charts/editor";
import { Language } from "./charts/language";
import { Stats } from "./charts/stats";
import { DashboardProvider } from "./dashboard-state";
import { Header } from "./header";

export default async function Dashboard() {
  const allData = await getData();
  return (
    <DashboardProvider apiData={allData}>
      <main className="flex flex-1 flex-col gap-4 md:gap-8 pb-8">
        <Header />

        <div className="mx-auto w-full max-w-6xl container">
          <div className="grid grid-cols-4 gap-6">
            <Stats />
            <AcceptanceCount />
            <AcceptanceRate />
            <AcceptanceSuggestionsCount />
            <Language /> <Editor />
          </div>
        </div>
      </main>
    </DashboardProvider>
  );
}
