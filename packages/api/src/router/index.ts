import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { spotifyAuthRouter } from "./spotifyAuth";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  spotifyAuth: spotifyAuthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
