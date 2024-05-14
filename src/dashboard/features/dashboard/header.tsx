import { DatePickerWithRange } from "@/components/ui/data-picker";

import { PageHeader, PageTitle } from "../page-header/page-header";
import { ComboboxPopover } from "./filter/header-filter";

export const Header = () => {
  return (
    <PageHeader>
      <PageTitle>Dashboard</PageTitle>
      <div className="flex gap-8 justify-between">
        <ComboboxPopover />
        <DatePickerWithRange />
      </div>
    </PageHeader>
  );
};
