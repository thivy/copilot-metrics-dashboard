import { DatePickerWithRange } from "@/components/ui/data-picker";

import { PageHeader, PageTitle } from "../page-header/page-header";
import { Filters } from "./filter/header-filter";

export const Header = () => {
  return (
    <PageHeader>
      <PageTitle>Dashboard</PageTitle>
      <div className="flex gap-8 justify-between">
        <Filters />
        <DatePickerWithRange />
      </div>
    </PageHeader>
  );
};
