import { z } from "zod";

import { asc, desc, eq, schema } from "@task-tornado/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.team.findMany({ orderBy: desc(schema.team.id) });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.team.findFirst({
        where: eq(schema.team.id, input.id),
      });
    }),

  byUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.team.findMany({
      with: {
        usersToTeams: {
          where: (userId, { eq }) => eq(userId.userId, ctx.session.user.id),
        },
      },
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
        const newTeam = await tx.insert(schema.team).values({
          name: input.name,
          plan: input.plan,
        });
        await tx.insert(schema.usersToTeams).values({
          teamId: newTeam.insertId as unknown as number,
          userId: ctx.session.user.id,
          role: "owner",
        });
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.team).where(eq(schema.team.id, input));
  }),
});
