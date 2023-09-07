import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { auth } from "@task-tornado/auth";

import { taskSchema } from "./_components/_schema";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { UserNav } from "./_components/user-nav";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/src/app/dashboard/_components/_tasks.json"),
  );

  // const tasks = JSON.parse(data.toString());

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
  const session = await auth();
  const tasks = await getTasks();

  return (
    <>
      <div className="h-full min-h-[calc(100vh-64px)] flex-1 flex-col space-y-8 bg-accent/20 p-8 ">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back {""}
              {session?.user?.name?.split(" ")[0]}!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
