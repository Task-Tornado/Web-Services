import { relations } from "drizzle-orm";
import { index, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const tasks = mySqlTable(
  "task",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    completed: varchar("completed", { length: 255 }),
  },
  (task) => ({
    nameIdx: index("name_idx").on(task.name),
  }),
);
