import { AppHeader } from "@/features/app-header/app-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Exp",
  description: "Dev Exp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/70 ">
      <AppHeader />
      {children}
    </div>
  );
}
