import React, { Suspense } from "react";

import { ModeToggle } from "~/components/ui/theme-toggle";
import { MainNav } from "./main-nav";
import { Search } from "./search";
import { TeamSwitcher } from "./team-switcher";
import { UserNav } from "./user-nav";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex h-16 items-center border-b bg-background px-4">
        <Suspense>
          <TeamSwitcher />
        </Suspense>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      {props.children}
    </div>
  );
}
