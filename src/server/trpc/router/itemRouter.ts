import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const itemRouter = router({
  createItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      const item = await ctx.prisma.shoppingItem.create({
        data: {
          name,
        },
      });
      return item;
    }),

  getItem: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    const items = await ctx.prisma.shoppingItem.findMany();
    return items;
  }),
  deleteItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const item = await ctx.prisma.shoppingItem.delete({
        where: {
          id,
        },
      });
      return item;
    }),
  checkItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, checked } = input;
      const item = await ctx.prisma.shoppingItem.update({
        where: {
          id,
        },
        data: {
          checked,
        },
      });
      return item;
    }),
});
