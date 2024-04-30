import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const PageHeader: FC<Props> = (props) => {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">{props.children}</div>
  );
};

export const PageTitle: FC<PropsWithChildren> = (props) => {
  return (
    <h1 className="text-3xl font-semibold tracking-tighter">
      {props.children}
    </h1>
  );
};
