import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import DashboardLayout from "./_components/dashboard-layout";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Task Tornado",
  description: "An AI powered task manager",
  openGraph: {
    title: "Task Tornado",
    description: "An AI powered task manager",
    url: "http://localhost:3000",
    siteName: "Task Tornado",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <DashboardLayout>
              <main>{props.children}</main>
              <Toaster />
            </DashboardLayout>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
