import Dashboard, { IProps } from "@/features/dashboard/dashboard-page";
import { Suspense } from "react";
import Loading from "./loading";

export default function DashboardPage(props: IProps) {
  let id = "initial-dashboard";

  if (props.searchParams.startDate && props.searchParams.endDate) {
    id = `${id}-${props.searchParams.startDate}-${props.searchParams.endDate}`;
  }

  return (
    <Suspense fallback={<Loading />} key={id}>
      <Dashboard {...props} />
    </Suspense>
  );
}
