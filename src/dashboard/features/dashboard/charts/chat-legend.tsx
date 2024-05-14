import { cn } from "@/lib/utils";

export const Legend = ({
  className,
  name,
}: {
  name: string;
  className: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className={cn("w-4 h-4 rounded-full", className)}></div>
      <div>{name}</div>
    </div>
  );
};
