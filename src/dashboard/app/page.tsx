"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={() => signIn("azure-ad")}> Microsoft 365</Button>
    </main>
  );
}
