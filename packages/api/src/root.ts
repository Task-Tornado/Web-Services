import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { teamRouter } from "./router/team";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
