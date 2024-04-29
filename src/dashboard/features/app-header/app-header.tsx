import { CircleUser, LayoutDashboard, Menu, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { MainNavItem } from "./main-nav-item";

const CompanyLogo = () => {
  return (
    <MainNavItem path="/dashboard">
      <Image
        src="/copilot.png"
        width={32}
        height={32}
        alt="Picture of the author"
      />
    </MainNavItem>
  );
};

const MenuItems = () => {
  return (
    <>
      <MainNavItem path="/dashboard">
        <LayoutDashboard size={18} strokeWidth={1.4} />
        Dashboard
      </MainNavItem>
      <MainNavItem path="/settings">
        <Settings size={18} strokeWidth={1.4} />
        Settings
      </MainNavItem>
    </>
  );
};

export const AppHeader = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between sm:justify-normal">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 flex-1">
        <CompanyLogo />
        <MenuItems />
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <CompanyLogo />
            <MenuItems />
          </nav>
        </SheetContent>
      </Sheet>
      <nav className="md:hidden">
        <CompanyLogo />
      </nav>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
