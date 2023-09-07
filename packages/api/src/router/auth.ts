import { z } from "zod";

import { eq } from "@task-tornado/db";
import { sessions } from "@task-tornado/db/schema/auth";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  updateSessionTeam: protectedProcedure
    .input(z.object({ teamId: z.number() }))

    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        await tx
          .update(sessions)
          .set({
            currentTeamId: input.teamId,
          })
          .where(eq(sessions.userId, ctx.session.user.id));
      });
    }),
});
