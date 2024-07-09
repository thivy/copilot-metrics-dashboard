import { DatePickerWithRange } from "@/components/ui/data-picker";

import { PageHeader, PageTitle } from "../page-header/page-header";
import { Filters } from "./filter/header-filter";
import { TimeFrameToggle } from "./filter/time-frame-toggle";

export const Header = () => {
  return (
    <PageHeader>
      <PageTitle>Dashboard</PageTitle>
      <div className="flex gap-8 justify-between">
        <Filters />
        <div className="flex gap-2">
          <TimeFrameToggle />
          <DatePickerWithRange />
        </div>
      </div>
    </PageHeader>
  );
};
