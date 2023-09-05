import "~/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

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
          <DashboardLayout>{props.children}</DashboardLayout>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
