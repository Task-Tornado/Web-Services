import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@task-tornado/auth";

import { ThemeProvider } from "~/components/theme-provider";
import { ModeToggle } from "~/components/ui/theme-toggle";
import { Toaster } from "~/components/ui/toaster";
import { MainNav } from "./_components/main-nav";
import { Search } from "./_components/search";
import { TeamSwitcher } from "./_components/team-switcher";
import { UserNav } from "./_components/user-nav";

export default async function Page(props: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin/google");
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
      <main>{props.children}</main>
      <Toaster />
    </ThemeProvider>
  );
}
