import { redirect } from "next/navigation";

import { auth } from "@task-tornado/auth";

import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import DashboardLayout from "./_components/dashboard-layout";

export default async function Page(props: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin/google");
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <main>{props.children}</main>
        <Toaster />
      </DashboardLayout>
    </ThemeProvider>
  );
}
