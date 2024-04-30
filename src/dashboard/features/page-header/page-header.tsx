import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const PageHeader = (props: Props) => {
  return (
    <div className="bg-background py-8 border-b">
      <div className="mx-auto grid grid-cols-2 w-full max-w-6xl gap-2 container">
        {props.children}
      </div>
    </div>
  );
};

export const PageTitle: FC<PropsWithChildren> = (props) => {
  return (
    <h1 className="text-3xl font-semibold tracking-tighter">
      {props.children}
    </h1>
  );
};