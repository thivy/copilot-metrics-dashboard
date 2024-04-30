import { DatePickerWithRange } from "@/components/ui/data-picker";
import { PageHeader, PageTitle } from "@/features/page-header/page-header";
import { HeroChart } from "./hero-chart";
import StatsCard from "./stats-card";
import { TopLanguageChart } from "./top-language-chart";

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 pb-8">
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <div className="flex justify-end">
          <DatePickerWithRange />
        </div>
      </PageHeader>
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
          <HeroChart />
          <TopLanguageChart /> <TopLanguageChart />
        </div>
      </div>
    </main>
  );
}