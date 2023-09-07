import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const task = mySqlTable(
  "task",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: text("status", { enum: ["todo", "inProgress", "done"] }).notNull(),
  },
  (task) => ({
    nameIdx: index("name_idx").on(task.name),
  }),
);

export const taskRelations = relations(task, ({ one, many }) => ({
  users: many(users),
}));

export const createTaskSchema = createInsertSchema(task);
export const selectTeamSchema = createInsertSchema(task);

export type CreateTask = z.infer<typeof createTaskSchema>;
export type SelectTask = z.infer<typeof selectTeamSchema>;
