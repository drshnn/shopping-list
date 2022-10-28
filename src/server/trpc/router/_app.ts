// src/server/router/_app.ts
import { router } from "../trpc";
import { itemRouter } from "./itemRouter";

export const appRouter = router({
  item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
