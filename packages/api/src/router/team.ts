import { z } from "zod";

import { desc, eq, schema } from "@task-tornado/db";
import { mySqlTable } from "@task-tornado/db/schema/_table";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.team.findMany({ orderBy: desc(schema.team.id) });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.team.findFirst({
        where: eq(schema.team.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string({
            invalid_type_error: "Title must be a string",
            required_error: "Please provide a title",
          })
          .min(1, { message: "Title must be at least 1 character long" }),
        plan: z.enum(["free", "pro", "advanced"], {
          invalid_type_error:
            "Plan must be one of 'free', 'pro', or 'advanced'",
          required_error: "Please pick a plan",
        }),
      }),
    )

    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        await tx.insert(schema.team).values({
          name: input.name,
          plan: input.plan,
        });
        const team = await tx.query.team.findFirst({
          where: eq(schema.team.name, input.name),
        });
        if (team) {
          await tx.insert(schema.usersToTeams).values({
            teamId: team.id,
            userId: ctx.session.user.id,
            role: "owner",
          });
        } else {
          throw new Error("Team not found");
        }
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.team).where(eq(schema.team.id, input));
  }),
});
